import { useState, useCallback } from 'react'
import {
  DndContext,
  PointerSensor,
  DragOverlay,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { AlertTriangle, BarChart2, Layers } from 'lucide-react'
import { clsx } from 'clsx'
import { useTriageContext } from '../store/TriageContext'
import KanbanCard from '../components/KanbanCard'
import KanbanColumn from '../components/KanbanColumn'
import InquiryPanel from '../components/InquiryPanel'
import type { ScoredInquiry, Tier } from '../types'

type ViewMode = 'score' | 'stage'

const SCORE_COLUMNS: { id: Tier; title: string; dot: string; header: string }[] = [
  { id: 'hot',  title: 'Hot',  dot: 'bg-red-500',    header: 'bg-red-50 border-red-100' },
  { id: 'warm', title: 'Warm', dot: 'bg-amber-400',  header: 'bg-amber-50 border-amber-100' },
  { id: 'cold', title: 'Cold', dot: 'bg-indigo-400', header: 'bg-indigo-50 border-indigo-100' },
]

const STAGE_COLUMNS: {
  id: 'new' | 'contacted' | 'qualified'
  title: string
  dot: string
  header: string
  empty: string
}[] = [
  { id: 'new',       title: 'New',       dot: 'bg-slate-400', header: 'bg-slate-100 border-slate-200', empty: 'No new inquiries'       },
  { id: 'contacted', title: 'Contacted', dot: 'bg-blue-400',  header: 'bg-blue-50 border-blue-100',   empty: 'Nobody contacted yet'   },
  { id: 'qualified', title: 'Qualified', dot: 'bg-brand-500', header: 'bg-brand-50 border-brand-100', empty: 'No qualified leads'     },
]

export default function Triage() {
  const { sortedInquiries, updateStatus, overdueCount } = useTriageContext()
  const [view, setView] = useState<ViewMode>('score')
  const [selected, setSelected] = useState<ScoredInquiry | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const active = sortedInquiries.filter((i) => i.status !== 'won' && i.status !== 'closed')

  // In score view we pass no sensors → DndContext exists but DnD is inert
  const stageSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )
  const noSensors = useSensors()

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setDraggingId(String(event.active.id))
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setDraggingId(null)
      const { active: dragged, over } = event
      if (!over) return
      const targetStage = over.id as 'new' | 'contacted' | 'qualified'
      const inquiry = sortedInquiries.find((i) => i.id === String(dragged.id))
      if (!inquiry || inquiry.status === targetStage) return
      updateStatus(String(dragged.id), targetStage)
      if (selected?.id === String(dragged.id)) {
        setSelected({ ...inquiry, status: targetStage })
      }
    },
    [sortedInquiries, updateStatus, selected],
  )

  const draggingInquiry = draggingId ? sortedInquiries.find((i) => i.id === draggingId) : null
  const handleSelect = useCallback((inquiry: ScoredInquiry) => setSelected(inquiry), [])
  const handleClose = useCallback(() => setSelected(null), [])

  const isStage = view === 'stage'

  return (
    <DndContext
      sensors={isStage ? stageSensors : noSensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col p-6 gap-4">
        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Inquiry Triage</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {active.length} active · scored Hot / Warm / Cold by volume, urgency &amp; channel
            </p>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setView('score')}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all',
                !isStage ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700',
              )}
            >
              <BarChart2 size={13} />
              Lead Score
            </button>
            <button
              onClick={() => setView('stage')}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all',
                isStage ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700',
              )}
            >
              <Layers size={13} />
              Lead Stage
            </button>
          </div>
        </div>

        {/* Overdue banner */}
        {overdueCount > 0 && (
          <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 flex-shrink-0">
            <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-800">
              <span className="font-semibold">
                {overdueCount} {overdueCount === 1 ? 'inquiry' : 'inquiries'} overdue
              </span>
              {' '}— New leads waiting 7+ days are highlighted with an orange border.
            </p>
          </div>
        )}

        {/* Stage hint */}
        {isStage && (
          <p className="text-xs text-slate-400 flex-shrink-0 -mt-1">
            Drag cards between columns to update stage. Click any card to open details and mark as Won.
          </p>
        )}

        {/* Board */}
        <div className="flex gap-3 w-full items-start">
          {isStage
            ? STAGE_COLUMNS.map((col) => {
                const cards = active.filter((i) => i.status === col.id)
                return (
                  <KanbanColumn
                    key={col.id}
                    id={col.id}
                    title={col.title}
                    count={cards.length}
                    dotColor={col.dot}
                    headerColor={col.header}
                    droppable
                    emptyMessage={col.empty}
                  >
                    {cards.map((inq) => (
                      <KanbanCard key={inq.id} inquiry={inq} draggable onClick={handleSelect} />
                    ))}
                  </KanbanColumn>
                )
              })
            : SCORE_COLUMNS.map((col) => {
                const cards = active.filter((i) => i.tier === col.id)
                return (
                  <KanbanColumn
                    key={col.id}
                    id={col.id}
                    title={col.title}
                    count={cards.length}
                    dotColor={col.dot}
                    headerColor={col.header}
                  >
                    {cards.map((inq) => (
                      <KanbanCard key={inq.id} inquiry={inq} onClick={handleSelect} />
                    ))}
                  </KanbanColumn>
                )
              })}
        </div>

        {/* Drag ghost */}
        <DragOverlay dropAnimation={null}>
          {draggingInquiry ? (
            <KanbanCard inquiry={draggingInquiry} draggable isOverlay onClick={() => {}} />
          ) : null}
        </DragOverlay>

        {/* Side panel */}
        <InquiryPanel inquiry={selected} onClose={handleClose} />
      </div>
    </DndContext>
  )
}
