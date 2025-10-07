import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ServerMonitoring } from "@/types/admin";

interface DeleteServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server: ServerMonitoring | null;
  onConfirm: () => void;
}

const DeleteServerDialog = ({
  open,
  onOpenChange,
  server,
  onConfirm,
}: DeleteServerDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить сервер</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите удалить сервер "{server?.name}" из мониторинга?
            Это действие нельзя отменить, и сервер перестанет отображаться для игроков.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteServerDialog;