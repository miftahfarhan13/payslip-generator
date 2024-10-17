import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
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
import { ReloadIcon } from "@radix-ui/react-icons";

export default function GenerateEmployees() {
  const searchParams = useSearchParams();
  const periodsParams = searchParams.get("period");

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
              //   handleSubmit();
            }}
          >
            <div className="flex flex-col gap-5">
              <div className="grid gap-4 py-4">
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
