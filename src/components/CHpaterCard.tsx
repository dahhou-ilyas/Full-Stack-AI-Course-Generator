"use client"
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Chapter } from 'prisma/prisma-client'
import React, { useState } from 'react'
import { useToast } from './ui/use-toast'

type Props = {
    chapter:Chapter
    chapterIndex:number
}
export type ChapterCardHandler={
    triggerLoad:()=>void
}


//pour passer une Ref sur un componant spécialiser c'est à dire nous qui nous alons crée il faut utiliser ()
const  CHpaterCard=React.forwardRef<ChapterCardHandler,Props>(({chapter,chapterIndex},ref)=> {
    const {toast}=useToast()
    const [sucess,setSucess]=useState<boolean | null>(null);
    const {mutate:getChapterInfo,isLoading}=useMutation({
        mutationFn:async ()=>{
            const response=await axios. post("/api/chapter/getInfo",{
               chapterId: chapter.id
            })
            return response.data
        }
    })
    React.useImperativeHandle(ref,()=>({
        //lorsque on click sur le button generating on execute le trigger function cette fonction appller en parallele getChapterInfo sur chaque card de chaptire cela permet de call endpoint "/api/chapter/getInfo" parallelement
        async triggerLoad(){
            getChapterInfo(undefined,{
                onSuccess:()=>{
                    setSucess(true);
                },
                onError:(error)=>{
                    console.log(error);
                    setSucess(false);
                    toast({
                        title:"Error",
                        description:"Is an error in loading your chapter",
                        variant:"destructive"
                    })
                }
            })
        }
    }))
  return (
    <div key={chapter.id} className={
        cn("px-4 py-2 mt-2 rounded flex justify-between",{
            'bg-indigo-200 dark:bg-secondary/50':sucess==null,
            "bg-red-400 dark:bg-red-500":sucess==false,
            "bg-teal-400 dark:bg-green-500":sucess==true
        })
    }>
        <h5>Chpater {chapterIndex+1} {chapter.name}</h5>
    </div>
  )
})

CHpaterCard.displayName="CHpaterCard"
export default CHpaterCard