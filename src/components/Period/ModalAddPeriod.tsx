import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPeriod, updatePeriod } from "@/services/period";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import moment from "moment";

export default function ModalAddPeriod({
  id,
  nameProps,
  periodProps,
  type,
}: {
  id?: string;
  nameProps?: string;
  periodProps?: string;
  type: string;
}) {
  const query = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [period, setPeriod] = useState("");

  useEffect(() => {
    setName(nameProps || "");
    setPeriod(moment(new Date(periodProps || "")).format("YYYY-MM-DD") || "");
  }, [nameProps, periodProps]);

  const mutationCreate = useMutation({ mutationFn: createPeriod });
  const mutationUpdate = useMutation({ mutationFn: updatePeriod });

  const handleSubmitCreate = () => {
    setIsLoading(true);
    mutationCreate.mutate(
      { name, date: period },
      {
        onSuccess() {
          setIsLoading(false);
          setOpen(false);
          setName("");
          setPeriod("");
          query.invalidateQueries({ queryKey: ["periods"] });
          query.invalidateQueries({ queryKey: ["period"] });
        },
        onError(error) {
          setIsLoading(false);
          if (error) {
            // @ts-ignore
            const message = error?.response?.data?.message
              ? // @ts-ignore
                error?.response?.data?.message
              : error?.message;
          }
        },
      }
    );
  };

  const handleSubmitUpdate = () => {
    setIsLoading(true);
    mutationUpdate.mutate(
      { id: id || "", name, date: period },
      {
        onSuccess() {
          setIsLoading(false);
          setOpen(false);
          query.invalidateQueries({ queryKey: ["periods"] });
          query.invalidateQueries({ queryKey: ["period"] });
        },
        onError(error) {
          setIsLoading(false);
          if (error) {
            // @ts-ignore
            const message = error?.response?.data?.message
              ? // @ts-ignore
                error?.response?.data?.message
              : error?.message;
          }
        },
      }
    );
  };

  const handleSubmit = () => {
    if (type === "create") handleSubmitCreate();
    else handleSubmitUpdate();
  };

  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Icon icon={type === "create" ? "line-md:plus" : "line-md:edit"} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>
            {type === "create" ? "Add" : "Update"} Period
          </DialogTitle>
          {type === "create" && (
            <DialogDescription>
              Add period to start generating pdf.
            </DialogDescription>
          )}
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="flex flex-col gap-5">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Name"
                  className="col-span-3"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Date Period
                </Label>
                <Input
                  id="username"
                  type="date"
                  placeholder="Date Period"
                  className="col-span-3"
                  required
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                />
              </div>
            </div>
            <Button disabled={isLoading} type="submit" className="self-end">
              {isLoading && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
