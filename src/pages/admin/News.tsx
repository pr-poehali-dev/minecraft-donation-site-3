import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { NewsItem } from "@/types/news";
import { mockNews, newsCategories } from "@/data/newsData";
import { getCurrentUser, logoutUser } from "@/utils/authUtils";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AdminUser } from "@/types/admin";

const AdminNews = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const userData = getCurrentUser();
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/admin/login");
  };

  const handleSave = (newsData: Partial<NewsItem>) => {
    if (editingNews) {
      // Редактирование
      setNews((prev) =>
        prev.map((item) =>
          item.id === editingNews.id
            ? { ...item, ...newsData, updatedAt: new Date().toISOString() }
            : item,
        ),
      );
    } else {
      // Создание новой новости
      const newNews: NewsItem = {
        id: Date.now().toString(),
        title: newsData.title || "",
        excerpt: newsData.excerpt || "",
        content: newsData.content || "",
        imageUrl: newsData.imageUrl || "",
        category: (newsData.category as any) || "announcement",
        isPublished: newsData.isPublished || false,
        author: user?.username || "Admin",
        tags: newsData.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNews((prev) => [newNews, ...prev]);
    }
    setIsDialogOpen(false);
    setEditingNews(null);
  };

  const handleDelete = (id: string) => {
    setNews((prev) => prev.filter((item) => item.id !== id));
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader user={user} onLogout={handleLogout} />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Управление новостями</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingNews(null)}>
                  <Icon name="Plus" size={16} className="mr-2" />
                  Создать новость
                </Button>
              </DialogTrigger>
              <NewsDialog
                news={editingNews}
                onSave={handleSave}
                onClose={() => setIsDialogOpen(false)}
              />
            </Dialog>
          </div>

          <div className="grid gap-4">
            {news.map((item) => (
              <Card key={item.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          className={`${newsCategories.find((c) => c.id === item.category)?.color} text-white border-0`}
                        >
                          {
                            newsCategories.find((c) => c.id === item.category)
                              ?.name
                          }
                        </Badge>
                        <Badge
                          variant={item.isPublished ? "default" : "secondary"}
                        >
                          {item.isPublished ? "Опубликовано" : "Черновик"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingNews(item)}
                        >
                          <Icon name="Edit" size={16} />
                        </Button>
                      </DialogTrigger>
                      <NewsDialog
                        news={item}
                        onSave={handleSave}
                        onClose={() => setEditingNews(null)}
                      />
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-2">
                    {item.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Автор: {item.author}</span>
                    <span>
                      Создано:{" "}
                      {new Date(item.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                    <span>
                      Обновлено:{" "}
                      {new Date(item.updatedAt).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

interface NewsDialogProps {
  news: NewsItem | null;
  onSave: (data: Partial<NewsItem>) => void;
  onClose: () => void;
}

const NewsDialog = ({ news, onSave, onClose }: NewsDialogProps) => {
  const [formData, setFormData] = useState({
    title: news?.title || "",
    excerpt: news?.excerpt || "",
    content: news?.content || "",
    imageUrl: news?.imageUrl || "",
    category: news?.category || "announcement",
    isPublished: news?.isPublished || false,
    tags: news?.tags?.join(", ") || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
  };

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {news ? "Редактировать новость" : "Создать новость"}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Заголовок</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="excerpt">Краткое описание</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
            }
            rows={2}
            required
          />
        </div>

        <div>
          <Label htmlFor="content">Содержание (Markdown)</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, content: e.target.value }))
            }
            rows={8}
            required
          />
        </div>

        <div>
          <Label htmlFor="imageUrl">URL изображения</Label>
          <Input
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Категория</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {newsCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="tags">Теги (через запятую)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, tags: e.target.value }))
            }
            placeholder="обновление, событие, исправления"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="published"
            checked={formData.isPublished}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isPublished: checked }))
            }
          />
          <Label htmlFor="published">Опубликовать</Label>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit">Сохранить</Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default AdminNews;
