import { Badge } from '@/components/ui'
import { statusInfo } from '@/lib/opcoes'

export default function StatusBadge({ lista, value }) {
  const s = statusInfo(lista, value)
  return <Badge color={s.color}>{s.label}</Badge>
}
