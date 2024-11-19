import { useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateEmployees } from "@/services/employees";
import { useToast } from "@/hooks/use-toast";

export default function GenerateEmployees({
  periodName,
}: {
  periodName: string;
}) {
  const query = useQueryClient();
  const { toast } = useToast();

  const fileUpload = useRef<HTMLInputElement>(null);

  const [companyType, setCompanyType] = useState("");

  const searchParams = useSearchParams();
  const periodsParams = searchParams.get("period");

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const mutationCreate = useMutation({ mutationFn: generateEmployees });

  const handleSubmit = () => {
    setIsLoading(true);

    // @ts-ignore
    const file = fileUpload.current.files[0];

    if (
      file["type"] !== "application/vnd.ms-excel" &&
      file["type"] !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      toast({
        title: "Failed",
        description: "Please only upload excel file",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const form = new FormData();
    form.append("file", file || ""); // Assuming periodsParams is the file
    form.append("periodId", periodsParams || "");
    form.append("companyType", companyType);
    form.append("periodName", periodName);

    mutationCreate.mutate(form, {
      onSuccess() {
        setIsLoading(false);
        setOpen(false);
        toast({
          title: "Success",
          description: "Success generate pdf payslip",
          variant: "default",
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
    });
  };
  return (
    <>
      <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
        <DialogTrigger asChild>
          {periodsParams && (
            <Button size="icon" variant="outline" hidden>
              <Icon icon="vscode-icons:file-type-excel" />
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Generate Payslip</DialogTitle>
            <DialogDescription>
              Choose your excel file to start generate payslip.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="flex flex-col gap-5">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-5 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Company
                  </Label>
                  <Select
                    value={companyType}
                    onValueChange={(value) => setCompanyType(value)}
                    name="companyType"
                    required
                  >
                    <SelectTrigger className="col-span-4">
                      <SelectValue placeholder="Select Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dibimbing">Dibimbing</SelectItem>
                      <SelectItem value="Cakrawala">Cakrawala</SelectItem>
                      <SelectItem value="Dibilabs">Dibilabs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-5 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Excel File
                  </Label>
                  <Input
                    id="file"
                    placeholder="File"
                    className="col-span-4"
                    required
                    type="file"
                    ref={fileUpload}
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
    </>
  );
}
