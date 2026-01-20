"use client";
import { createClient } from "@/lib/client";
import { useCallback, useEffect, useState } from "react";

export type TypeInput = 'start' | 'finish'

export interface TimeRecord {
  start: number
  finish: number
}

const initialData:TimeRecord = {
  finish:0,
  start:0
}

type Payload = {
  type: string,
  event: string,
  payload:{
    type: TypeInput
    value: number
  }
}

export function useRegisterTime() {
  const supabase = createClient();
  const [records, setRecords] = useState<TimeRecord>(initialData)
  const [channel, setChannel] = useState<ReturnType<typeof supabase.channel> | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const newChannel = supabase.channel('crono-beta')

    newChannel.on('broadcast',{event:'message'}, (payload:Payload) => {
      const {type,value} = payload.payload
      setRecords( (current) => ({...current,[type]:value}) )
    }) 
    .subscribe( async (status:string) => {
      if (status === 'SUBSCRIBED') {
        setIsConnected(true)
      } else {
        setIsConnected(false)
      }
    })

    setChannel(newChannel)

    return () => { supabase.removeChannel(newChannel) }
    
  }, [supabase]);

  const saveRecord = useCallback(
    async (type:TypeInput,value:number) => {
      if(!channel || !isConnected) return

      setRecords( current => ({...current,[type]:value}) )

      await channel.send({
        type: 'broadcast',
        event: 'message',
        payload: {type,value},
      })

    },[channel,isConnected]
  )

  return { records, saveRecord, isConnected }
}
