import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { BlogPost } from "@/data/blogPosts";

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

const BlogCard = ({ post, index }: BlogCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-medium transition-shadow duration-300 group"
    >
      <Link to={`/blog/${post.slug}`} className="block">
        {/* Category Badge */}
        <div className="p-6 pb-0">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-body font-medium">
            {post.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-heading text-xl text-card-foreground mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-muted-foreground font-body text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-body mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>

          {/* Read More */}
          <div className="flex items-center gap-2 text-primary font-body text-sm font-medium group-hover:gap-3 transition-all duration-300">
            Ler mais
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;
