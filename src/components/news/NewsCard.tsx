import { NewsItem, NewsCategory } from "@/types/news";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

interface NewsCardProps {
  news: NewsItem;
  categories: NewsCategory[];
}

const NewsCard = ({ news, categories }: NewsCardProps) => {
  const category = categories.find((cat) => cat.id === news.category);

  return (
    <Link to={`/news/${news.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className="relative overflow-hidden">
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <Badge className={`${category?.color} text-white border-0`}>
              <Icon name={category?.icon as any} size={12} className="mr-1" />
              {category?.name}
            </Badge>
          </div>
        </div>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Icon name="Calendar" size={14} />
            {new Date(news.createdAt).toLocaleDateString("ru-RU")}
            <Icon name="User" size={14} className="ml-2" />
            {news.author}
          </div>
          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {news.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
            {news.excerpt}
          </p>
          <div className="flex flex-wrap gap-1">
            {news.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default NewsCard;
