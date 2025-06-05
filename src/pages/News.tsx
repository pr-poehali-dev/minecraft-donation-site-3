import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsCard from "@/components/news/NewsCard";
import NewsDetail from "@/components/news/NewsDetail";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { mockNews, newsCategories } from "@/data/newsData";

const News = () => {
  const { id } = useParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Если есть ID, показываем детальную страницу новости
  if (id) {
    const news = mockNews.find((n) => n.id === id);
    if (!news) {
      return (
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 container py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Новость не найдена</h1>
              <Button asChild>
                <a href="/news">Вернуться к новостям</a>
              </Button>
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container py-8">
          <NewsDetail news={news} categories={newsCategories} />
        </main>
        <Footer />
      </div>
    );
  }

  const filteredNews =
    selectedCategory === "all"
      ? mockNews.filter((news) => news.isPublished)
      : mockNews.filter(
          (news) => news.isPublished && news.category === selectedCategory,
        );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">
            📰 Новости сервера
          </h1>
          <p className="text-xl text-muted-foreground animate-fade-in">
            Следите за последними обновлениями и событиями
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className="animate-fade-in"
          >
            <Icon name="Newspaper" size={16} className="mr-2" />
            Все новости
          </Button>
          {newsCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="animate-fade-in"
            >
              <Icon name={category.icon as any} size={16} className="mr-2" />
              {category.name}
            </Button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news, index) => (
            <div
              key={news.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <NewsCard news={news} categories={newsCategories} />
            </div>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <Icon
              name="FileText"
              size={48}
              className="mx-auto text-muted-foreground mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Новостей не найдено</h3>
            <p className="text-muted-foreground">
              В этой категории пока нет новостей
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default News;
