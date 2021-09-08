import json
from re import S
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import AnonymousUser
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.http.request import HttpRequest
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
import random

from . models import Follow, User, Post


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        first = request.POST["first"]
        last = request.POST["last"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password, first_name=first, last_name=last)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


# Show all of current user's posts
def index(request):
    posts = Post.objects.all().order_by('-timestamp')
    if request.user.is_anonymous:
        context = {"posts": posts}
    else:
        context = {
            "posts": posts,
            "recommend_follow": recommend_follow(request),
        }
    return render(request, "network/index.html", context)


# Add new post into database
def add_post(request):
    if request.method == "POST":
        body = request.POST["body"]
        post = Post(user=request.user, body=body)
        post.save()
    return HttpResponseRedirect(reverse(index))


# Edit selected post
@csrf_exempt
def edit_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        if (request.user != post.user):
            return JsonResponse({"error": "User may only edit their own post"})
    except:
        return JsonResponse({"error": "Post not found"})

    if request.method == "PUT":
        data = (json.loads(request.body))
        content = data.get("content")
        post.body = content
        post.save()
        return JsonResponse({
            "message": "Post successfully edited",
            "content": post.body,
        })
    else:
        return JsonResponse({"error": "PUT request required"}, status=400)

# Update the like count for a post
@csrf_exempt
@login_required
def update_likes(request, post_id):
    try:
        currently_liked = None
        post = Post.objects.get(id=post_id)
        if request.user in post.likes.all():
            post.likes.remove(request.user)
            currently_liked = False
        else:
            post.likes.add(request.user)
            currently_liked = True
        return JsonResponse({
            "message": "Like updated",
            "count": post.total_likes(),
            "currently_liked": currently_liked,
        })
    except:
        return JsonResponse({"message": "Post not found"}, status=400)


def following(request):
    current_user = User.objects.get(username=request.user)
    currently_following = current_user.following.all()
    followed_posts = []
    for user in currently_following:
        followed_posts += (user.following.posts.all())
    followed_posts.sort(key=lambda post: post.timestamp, reverse=True)
    context = {
        "followed_posts": followed_posts,
        "recommend_follow": recommend_follow(request), 
    }
    return render(request, "network/following.html", context)


def profile(request, username):
    current_user = User.objects.get(username=request.user)
    viewed_user = User.objects.get(username=username)
    
    context = {
        "currently_followed": len(Follow.objects.filter(user=current_user).filter(following=viewed_user)),
        "follower_count": viewed_user.followers.all().count(),
        "following_count": viewed_user.following.all().count(),
        "recommend_follow": recommend_follow(request),
        "viewed_user": viewed_user,
        "viewed_user_posts": viewed_user.posts.all().order_by('-timestamp'),
    }
    return render(request, "network/profile.html", context)


def recommend_follow(request):
    current_user = User.objects.get(username=request.user)
    not_following = User.objects.exclude(
        followers__user=current_user
    ).exclude(username=current_user)
    
    if len(not_following) > 3: sample_size = 3
    else: sample_size = len(not_following)
    
    not_following = random.sample(list(not_following), sample_size)
    return not_following


# Create a new Follow instance for the current user
def toggle_follow(request, username):
    current_user = User.objects.get(username=request.user)
    viewed_user = User.objects.get(username=username)

    following = (Follow.objects.filter(user=current_user).filter(following=viewed_user))

    if len(following):
        following[0].delete()
        return JsonResponse(
            {"message": "Unfollowed",
            "viewed_user_followers": viewed_user.followers.all().count()})
    else:
        follow = Follow(user=request.user, following=viewed_user)
        follow.save()
        return JsonResponse(
            {"message": "Followed",
            "viewed_user_followers": viewed_user.followers.all().count()})