import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getCurrentUser, logoutUser } from "@/utils/authUtils";
import { AdminUser } from "@/types/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";

const PRODUCTS_API_URL = "https://functions.poehali.dev/6574f144-b26c-46e4-a4eb-76db7d5dca00";

interface Purchase {
  id: string;
  productId: string;
  productName: string;
  playerNickname: string;
  serverId: string;
  pricePaid: number;
  status: string;
  createdAt: string;
  deliveredAt?: string;
}

const AdminPurchases = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const userData = getCurrentUser();
    if (userData) {
      setUser(userData);
    }
    
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      const response = await fetch(`${PRODUCTS_API_URL}?action=purchases`);
      const data = await response.json();
      
      if (data.success && data.purchases) {
        setPurchases(data.purchases);
      }
    } catch (error) {
      console.error("Ошибка загрузки покупок:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/admin/login");
  };

  const filteredPurchases = purchases.filter(p => 
    p.playerNickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.productName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-500">Доставлено</Badge>;
      case 'pending':
        return <Badge variant="secondary">Ожидание</Badge>;
      case 'failed':
        return <Badge variant="destructive">Ошибка</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">История покупок</h1>
            <p className="text-muted-foreground">
              Все транзакции и доставки товаров игрокам
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Покупки ({filteredPurchases.length})</CardTitle>
                <div className="w-full max-w-sm">
                  <div className="relative">
                    <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Поиск по нику или товару..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Icon name="Loader2" className="w-8 h-8 animate-spin" />
                  <span className="ml-3 text-muted-foreground">Загрузка...</span>
                </div>
              ) : filteredPurchases.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="ShoppingBag" className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Нет покупок</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? 'Ничего не найдено по вашему запросу' : 'Покупки появятся здесь после первой транзакции'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Дата</TableHead>
                        <TableHead>Игрок</TableHead>
                        <TableHead>Товар</TableHead>
                        <TableHead>Сервер</TableHead>
                        <TableHead className="text-right">Сумма</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Доставлено</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPurchases.map((purchase) => (
                        <TableRow key={purchase.id}>
                          <TableCell className="font-mono text-sm">
                            {new Date(purchase.createdAt).toLocaleString('ru-RU', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </TableCell>
                          <TableCell className="font-medium">
                            {purchase.playerNickname}
                          </TableCell>
                          <TableCell>
                            {purchase.productName || 'Товар удален'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {purchase.serverId}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {purchase.pricePaid} ₽
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(purchase.status)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {purchase.deliveredAt 
                              ? new Date(purchase.deliveredAt).toLocaleString('ru-RU', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : '—'
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon name="ShoppingCart" className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {purchases.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Всего покупок</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <Icon name="CheckCircle" className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {purchases.filter(p => p.status === 'delivered').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Доставлено</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <Icon name="DollarSign" className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {purchases.reduce((sum, p) => sum + p.pricePaid, 0).toFixed(0)} ₽
                    </div>
                    <div className="text-sm text-muted-foreground">Общая выручка</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPurchases;
