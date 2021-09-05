from django.contrib.auth.models import AbstractUser
from django.contrib.humanize.templatetags import humanize
from django.db import models

class User(AbstractUser):
    pass

class Post(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="posts")
    body = models.TextField(blank=True, max_length=280)
    likes = models.ManyToManyField("User", blank=True, related_name="likes")
    timestamp = models.DateTimeField(auto_now_add=True)

    def get_time(self):
        return humanize.naturaltime(self.timestamp)

    def __str__(self):
        return f"{self.id} - {self.user}"
    
    def total_likes(self):
        return self.likes.count()

class Follow(models.Model):
    user = models.ForeignKey("User", blank=False, on_delete=models.CASCADE, related_name="following")
    following = models.ForeignKey("User", blank=False, on_delete=models.CASCADE, related_name="followers")

    def __str__(self):
        return f"{self.user} follows {self.following}"