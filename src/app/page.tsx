"use client";

import { TimeRecord, useRegisterTime } from "@/hooks/use-register-time";
import { useCallback, useEffect, useMemo, useState } from "react";
type TypesRecord = '' | 'start' | 'finish'


const formatCrono = (time1:number,time2:number) => {
  const f0 = (number:number,zeros=2) => {
    const len = `${+number}`.length
    const _0 = '0'.repeat(zeros-len)

    return `${_0}${number}` 
  }
  let time = time2 - time1
  if(time<0) return (['00:00:00','.000'])

  const ms = f0(time % 1000,3)
  time = (time- +ms)/1000

  const s = f0(time % 60)
  time = (time- +s)/60

  const m = f0(time % 60)
  time = (time- +m)/60

  const h = f0(time % 24)
  time = (time- +h)/24
  
  return [`${h}:${m}:${s}`,`.${ms}`]
}


export default function HomePage() {
  const {records,saveRecord,isConnected} = useRegisterTime()

  const [value, setValue] = useState(['00:00:00','.000']);
  const [typeRecord, setTypeRecord] = useState<TypesRecord>('');
  const [message, setMessage] = useState('');

  console.log(records)
  
  const handleSubmit = useCallback(
    () => {
      if(!isConnected) return setMessage('No hay conexion :C')
      if(!typeRecord) return setMessage('Debes elegir una posicion')
      
      const time = (new Date()).getTime()
      saveRecord(typeRecord,time)
    },[typeRecord,isConnected,saveRecord]
  )

  useEffect(() => {
    const {start,finish} = records
    if(!start || !finish) return
    if(start > finish) return setMessage('El inicio no puede ser mayor al final')

    const ans = formatCrono(start,finish)
    setValue(ans)

  }, [records]);


  return (
    <div className="bg-background-dark text-white h-screen flex flex-col overflow-hidden select-none">
      <header className="h-20 border-b border-primary/20 flex flex-col justify-center px-4 bg-background-dark/95 backdrop-blur-xl z-50 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded bg-primary flex items-center justify-center text-background-dark">
              <span className="material-symbols-outlined font-bold text-[14px]">
                BB
              </span>
            </div>
            <h1 className="text-xs font-bold tracking-tight uppercase">
              Bike <span className="text-primary">Bros</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
              <span className="size-1.5 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-[8px] font-black text-primary uppercase tracking-wider">
                WebSocket
              </span>
            </div>
          </div>
        </div>
        <div className="relative w-full flex justify-between">
          <select 
            value={typeRecord}
            onChange={(e) => {setTypeRecord(e.target.value as TypesRecord);setMessage('')}}
            className="w-full bg-surface-dark border border-primary/30 text-xs font-bold uppercase tracking-widest text-white rounded-lg focus:ring-1 focus:ring-primary py-2 pl-3 pr-10 appearance-none cursor-pointer">
            <option value="" disabled>
              -- Selecciona la posicion --
            </option>
            <option value="start">Partida</option>
            <option value="finish">Llegada</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none"></span>
        </div>
      </header>
      <main className="flex-1 flex flex-col overflow-hidden bg-background-dark">
        <div className="px-4 py-3 flex items-center justify-between bg-white/5 border-b border-white/5 shrink-0">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase text-slate-500 font-bold tracking-widest">
              Tiempo Realizado:
            </span>
            <div className="flex items-baseline gap-1 tabular-nums leading-none">
              <span className="text-xl font-bold text-white">{value[0]}</span>
              <span className="text-xs font-medium text-primary/60">{value[1]}</span>
            </div>
          </div>
          <p className="text-[12px] uppercase text-slate-200 font-bold tracking-widest">
            {message}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Mediciones
              </h3>
            </div>
            <span className="text-[8px] font-bold text-primary/40 uppercase tracking-tighter">
              Lugar
            </span>
          </div>
          <div className="bg-primary p-3 rounded-xl flex items-center justify-between text-background-dark shadow-lg ring-4 ring-primary/10">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-lg font-bold tabular-nums tracking-tight">
                  {records.start}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-xl">PARTIDA</span>
          </div>
          <div className="bg-surface-dark border border-white/10 p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-bold tabular-nums text-slate-300">
                  {records.finish}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-primary text-[18px]">
              LLEGADA
            </span>
          </div>
        </div>
      </main>
      <footer className="p-4 bg-background-dark border-t border-primary/20 shrink-0 safe-bottom">
        <div className="flex flex-col gap-4">
          <button 
            onClick={handleSubmit}
            className="record-btn-active record-btn-shadow w-full h-24 rounded-2xl bg-surface-dark border-2 border-primary/60 flex items-center justify-between px-6 transition-all active:ring-4 active:ring-primary/30">
            <div className="flex flex-col items-start text-left">
              <span className="text-2xl font-black text-white uppercase tracking-tight leading-none">
                Guardar Tiempo
              </span>
              <span className="text-[10px] text-primary font-bold tracking-[0.2em] uppercase mt-1">
                Presiona para sincronizar
              </span>
            </div>
            <div className="size-14 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-primary">
                BB
              </span>
            </div>
          </button>
          <div className="flex justify-end items-center px-1">
            <span className="text-[8px] text-slate-600 font-bold uppercase">
              version beta - v0
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
