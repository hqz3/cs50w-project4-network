from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("add-post", views.add_post, name="add-post"),
    path("edit-post/<int:post_id>", views.edit_post, name="edit-post"),
    path("following", views.following, name="following"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("register", views.register, name="register"),
    path("update-profile", views.update_profile, name="update-profile"),

    # API Routes
    path("post/<int:post_id>", views.update_likes, name="like"),
    path("profile/<str:username>/toggle_follow", views.toggle_follow, name="toggle_follow"),
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)