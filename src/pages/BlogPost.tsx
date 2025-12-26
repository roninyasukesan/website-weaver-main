import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SocialShare from "@/components/SocialShare";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blogPosts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="bg-hero py-12 md:py-20">
          <div className="container-custom px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Back Button */}
              <Button
                variant="ghost"
                className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-hero-secondary mb-6"
                asChild
              >
                <Link to="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Blog
                </Link>
              </Button>

              {/* Category */}
              <span className="inline-block px-3 py-1 bg-primary-foreground/10 text-primary-foreground rounded-full text-xs font-body font-medium mb-4">
                {post.category}
              </span>

              {/* Title */}
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-6 max-w-4xl">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-primary-foreground/70 font-body">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.readTime} de leitura
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="bg-background py-12 md:py-16">
          <div className="container-custom px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
              {/* Article Content */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="prose prose-lg max-w-none font-body
                  prose-headings:font-heading prose-headings:text-foreground
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-muted-foreground prose-p:leading-relaxed
                  prose-li:text-muted-foreground
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-ul:my-4 prose-ol:my-4
                "
              >
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </motion.article>

              {/* Share Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-12 pt-8 border-t border-border"
              >
                <SocialShare url={currentUrl} title={post.title} />
              </motion.div>

              {/* CTA Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-12 bg-hero rounded-lg p-8 text-center"
              >
                <h3 className="font-heading text-2xl text-primary-foreground mb-4">
                  Precisa de ajuda com seu caso?
                </h3>
                <p className="text-primary-foreground/70 font-body mb-6">
                  Nossa equipe está pronta para analisar sua situação e lutar pelos seus direitos.
                </p>
                <Button variant="hero" size="lg" asChild>
                  <a
                    href="https://wa.me/5521969104121?text=Olá%20Keliane,%20vim%20através%20do%20site%20e%20gostaria%20de%20marcar%20uma%20consulta!"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Fale Conosco
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-secondary/50 section-padding">
            <div className="container-custom px-4 md:px-8">
              <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-8 text-center">
                Artigos Relacionados
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost, index) => (
                  <BlogCard key={relatedPost.id} post={relatedPost} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default BlogPost;
