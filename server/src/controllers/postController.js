import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: { select: { username: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(posts);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch posts", error: err.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Post content cannot be empty" });
    }

    const post = await prisma.post.create({
      data: { content, authorId: req.user.id },
    });

    res.json(post);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create post", error: err.message });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.authorId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    await prisma.post.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Post deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting post", error: error.message });
  }
};
