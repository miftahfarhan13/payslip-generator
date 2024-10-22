import React, { useState } from "react";
import { Button } from "../ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendEmailByUserId } from "@/services/employees";
import { useToast } from "@/hooks/use-toast";

export default function ButtonSendEmail({ id }: { id: string }) {
  const { toast } = useToast();
  const query = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);

  const mutationDelete = useMutation({ mutationFn: sendEmailByUserId });

  const handleSend = () => {
    setIsLoading(true);
    mutationDelete.mutate(
      { id },
      {
        onSuccess() {
          setIsLoading(false);
          toast({
            title: "Success",
            description: "Send Email Success",
          });
          query.invalidateQueries({ queryKey: ["employees"] });
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
    <>
      <Button variant="outline" onClick={handleSend}>
        {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        Send Email
        <Icon icon="streamline:send-email" />
      </Button>
    </>
  );
}
