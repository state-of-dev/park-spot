import { Badge } from '@/components/ui/badge'

type BookingStatus = 'pending' | 'confirmed' | 'upcoming' | 'completed' | 'cancelled' | 'no_show'

interface BookingStatusProps {
  status: BookingStatus
}

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }
> = {
  pending: { label: 'Pendiente', variant: 'secondary' },
  confirmed: { label: 'Confirmada', variant: 'default' },
  upcoming: { label: 'Próxima', variant: 'default' },
  completed: { label: 'Completada', variant: 'outline' },
  cancelled: { label: 'Cancelada', variant: 'destructive' },
  no_show: { label: 'No Show', variant: 'destructive' },
}

export function BookingStatus({ status }: BookingStatusProps) {
  const config = STATUS_CONFIG[status]

  return <Badge variant={config.variant}>{config.label}</Badge>
}
