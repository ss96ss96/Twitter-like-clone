import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getUserProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { posts: true },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
};

export const toggleFollow = async (req, res) => {
  const { id } = req.params; // userId to follow/unfollow
  try {
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.user.id,
          followingId: parseInt(id),
        },
      },
    });

    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      return res.json({ message: "Unfollowed user" });
    } else {
      await prisma.follow.create({
        data: { followerId: req.user.id, followingId: parseInt(id) },
      });
      return res.json({ message: "Followed user" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error toggling follow", error: error.message });
  }
};
