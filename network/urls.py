from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("post", views.post, name="post"),
    path("profile/<str:user>", views.profile, name="profile"),
    path("register", views.register, name="register"),

    # API Routes
    path("post/<int:post_id>", views.update_likes, name="like"),
]
