import onCopy from 'copy-to-clipboard'
import { toast } from '@pkg/utils'

export default function useCopy() {
  const copy = text => {
    if (onCopy(text)) {
      toast.success('复制成功')
    } else {
      toast.success('复制失败')
    }
  }

  return {
    copy,
  }
}
