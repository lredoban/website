import type { Handler } from '@netlify/functions'
import { useSupabase } from 'netlify/services/supabase'
import { findEnv, getRightKey, sendRes, transformEnvVar } from 'netlify/services/utils'
import type { definitions } from '~/types/supabase'

interface Params {
  service: string
}

export const handler: Handler = async(event) => {
  const body = event.queryStringParameters as any as Params
  const supabase = useSupabase(getRightKey(findEnv(event.rawUrl), 'supa_url'), transformEnvVar(findEnv(event.rawUrl), 'SUPABASE_ADMIN_KEY'))
  if (body.service === 'database') {
    const { data, error } = await supabase
      .from<definitions['apps']>('apps')
      .select()
      .eq('app_id', 'unknow.unknow')
      .single()
    if (data && !error) { return sendRes() }
    else {
      console.error('db not answering as expected', error)
      return sendRes({ error: 'db not answering as expected' }, 500)
    }
  }
  return sendRes()
}
