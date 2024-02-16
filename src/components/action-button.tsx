import React, { useTransition } from "react"
import { Button } from "./ui/button";
import { Icons } from "./icons";

type ActionButtonProps = {
  callbackFunc: () => void;
  text: string;
  className: string;
}

export const ActionButton:React.FC<ActionButtonProps> = ({callbackFunc, text, className}) => {
  const [ isPending, startTransition ] = useTransition()
  const handleAction = async () => {
    startTransition(async () => {
      await callbackFunc()
    })
  }
  return (
    <Button disabled={isPending} onClick={handleAction} className={className}>
      {isPending ? (
        <>
          <Icons.spinner
            className="mr-2 size-4 animate-spin"
            aria-hidden="true"
          />
          <span>{text}</span>
        </>
      ) : (
        <span>{text}</span>
      )}
      <span className="sr-only">{text}</span>
    </Button>
  )
}