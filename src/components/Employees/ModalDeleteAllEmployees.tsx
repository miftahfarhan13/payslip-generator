import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { deleteAllByPeriodId } from "@/services/employees";
import { useToast } from "@/hooks/use-toast";

export default function ModalDeleteAllEmployee({ id }: { id: string }) {
  const { toast } = useToast();
  const query = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const mutationDelete = useMutation({ mutationFn: deleteAllByPeriodId });

  const handleSubmit = () => {
    setIsLoading(true);
    mutationDelete.mutate(
      { periodId: id },
      {
        onSuccess() {
          setIsLoading(false);
          setOpen(false);
          toast({
            title: "Success",
            description: "Create FAQ Success",
          });
          query.invalidateQueries({ queryKey: ["employees"] });
          query.invalidateQueries({ queryKey: ["periods"] });
          query.invalidateQueries({ queryKey: ["employee"] });
        },
        onError(error) {
          setIsLoading(false);
          if (error) {
            // @ts-ignore
            const message = error?.response?.data?.message
              ? // @ts-ignore
                error?.response?.data?.message
              : error?.message;
            toast({
              title: "Failed",
              description: message,
              variant: "destructive",
            });
          }
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="text-red-500">
          <Icon icon="solar:trash-bin-trash-outline" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-row items-center gap-2.5">
              <p>Delete All Employee</p>
              <div className="text-red-500">
                <Icon icon="bx:trash" />
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            This action will delete all employees.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={isLoading}
            onClick={() => handleSubmit()}
            className="self-end"
            variant="destructive"
          >
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
