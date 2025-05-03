
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TopPlayersTable = () => {
  // В реальном приложении эти данные будут приходить с сервера
  const players = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    nickname: `Player${Math.floor(Math.random() * 1000)}`,
    playTime: Math.floor(Math.random() * 1000),
    lastLogin: new Date().toLocaleDateString('ru-RU'),
    online: Math.random() > 0.3
  }));

  return (
    <Card>
      <CardContent className="p-0 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Никнейм</TableHead>
              <TableHead>Время игры</TableHead>
              <TableHead>Последний вход</TableHead>
              <TableHead className="text-right">Статус</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map(player => (
              <TableRow key={player.id}>
                <TableCell className="font-medium">{player.id}</TableCell>
                <TableCell className="font-minecraft">{player.nickname}</TableCell>
                <TableCell>{player.playTime} ч</TableCell>
                <TableCell>{player.lastLogin}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={player.online ? "default" : "outline"}>
                    {player.online ? "Онлайн" : "Оффлайн"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopPlayersTable;
