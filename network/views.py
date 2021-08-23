from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.http.response import JsonResponse
from django.shortcuts import render
from django.urls import reverse

from . models import User, Post


def index(request):
    # Show all of the current user's posts
    posts = Post.objects.all().order_by('-timestamp')
    context = {"posts": posts}
    return render(request, "network/index.html", context)


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

# Add new post into database
def post(request):
    if request.method == "POST":
        body = request.POST["body"]
        post = Post(user=request.user, body=body)
        post.save()
    return HttpResponseRedirect(reverse(index))

# Update the like count for a post
def update_likes(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        if (request.user in post.likes.all()):
            post.likes.remove(request.user)
        else:
            post.likes.add(request.user)
        return JsonResponse({
            "success": "Like updated",
            "count": post.total_likes,
        })
    except:
        return JsonResponse({"error": "Post not found"}, status=404)