import { NewsItem, NewsCategory } from "@/types/news";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

interface NewsDetailProps {
  news: NewsItem;
  categories: NewsCategory[];
}

const NewsDetail = ({ news, categories }: NewsDetailProps) => {
  const category = categories.find((cat) => cat.id === news.category);

  return (
    <article className="max-w-4xl mx-auto">
      <Link to="/news">
        <Button variant="ghost" className="mb-6">
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Назад к новостям
        </Button>
      </Link>

      <div className="relative mb-8 rounded-xl overflow-hidden">
        <img
          src={news.imageUrl}
          alt={news.title}
          className="w-full h-64 md:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <Badge className={`${category?.color} text-white border-0 mb-4`}>
            <Icon name={category?.icon as any} size={14} className="mr-1" />
            {category?.name}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {news.title}
          </h1>
          <div className="flex items-center gap-4 text-white/80 text-sm">
            <div className="flex items-center gap-1">
              <Icon name="Calendar" size={14} />
              {new Date(news.createdAt).toLocaleDateString("ru-RU")}
            </div>
            <div className="flex items-center gap-1">
              <Icon name="User" size={14} />
              {news.author}
            </div>
          </div>
        </div>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
          {news.content}
        </div>
      </div>
    </article>
  );
};

export default NewsDetail;
