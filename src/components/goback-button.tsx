"use client";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./button";


  export function GoBackArrow() { 
    const router = useRouter();
    return (
      <Button
        variant="link"
        className="h-auto flex justify-between pl-0 pb-10"
        onClick={() => router.back()}
      >
        <ArrowLeftIcon /> Volver
      </Button>
    );
  }

