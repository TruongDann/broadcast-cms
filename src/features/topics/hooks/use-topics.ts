import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  topicsApi,
  type CreateTopicRequest,
  type UpdateTopicRequest,
} from '../api/topics-api'

// Query keys
export const topicKeys = {
  all: ['topics'] as const,
  lists: () => [...topicKeys.all, 'list'] as const,
  list: (filters: Record<string, string>) =>
    [...topicKeys.lists(), filters] as const,
  my: () => [...topicKeys.all, 'my'] as const,
  details: () => [...topicKeys.all, 'detail'] as const,
  detail: (id: string) => [...topicKeys.details(), id] as const,
  stats: () => [...topicKeys.all, 'stats'] as const,
}

// Get all topics
export function useTopics(filters?: { status?: string; contentType?: string }) {
  return useQuery({
    queryKey: topicKeys.list(filters || {}),
    queryFn: () => topicsApi.getAll(filters),
  })
}

// Get topic statistics
export function useTopicStats() {
  return useQuery({
    queryKey: topicKeys.stats(),
    queryFn: () => topicsApi.getStats(),
    staleTime: 30000, // 30 seconds
  })
}

// Get current user's topics
export function useMyTopics() {
  return useQuery({
    queryKey: topicKeys.my(),
    queryFn: () => topicsApi.getMyTopics(),
  })
}

// Get single topic
export function useTopic(id: string) {
  return useQuery({
    queryKey: topicKeys.detail(id),
    queryFn: () => topicsApi.getById(id),
    enabled: !!id,
  })
}

// Create topic mutation
export function useCreateTopic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTopicRequest) => topicsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: topicKeys.all })
    },
  })
}

// Update topic mutation
export function useUpdateTopic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTopicRequest }) =>
      topicsApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: topicKeys.detail(variables.id),
      })
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() })
    },
  })
}

// Delete topic mutation
export function useDeleteTopic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => topicsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: topicKeys.all })
    },
  })
}

// Submit topic for approval
export function useSubmitTopic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => topicsApi.submit(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: topicKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() })
    },
  })
}

// Approve topic
export function useApproveTopic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      topicsApi.approve(id, comment),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: topicKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() })
    },
  })
}

// Reject topic
export function useRejectTopic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      topicsApi.reject(id, comment),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: topicKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() })
    },
  })
}

// Request revision
export function useRequestRevision() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      topicsApi.requestRevision(id, comment),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: topicKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() })
    },
  })
}
