import { Event } from './event'
import { FullEvent, FullEventHandler } from './full-event'

export type EventBusImplBehaviour<EBID> = {
  unsubscribe: <E extends Event>(
    ebid: EBID,
    eventName: E['name'],
    eventHandler: FullEventHandler<FullEvent<E>>
  ) => Promise<EBID>
  subscribe: <E extends Event>(
    ebid: EBID,
    eventName: E['name'],
    eventHandler: FullEventHandler<FullEvent<E>>
  ) => Promise<EBID>
  publish: <E extends readonly FullEvent[]>(ebid: EBID, events: E) => Promise<E>
  pull: <E extends Event>(ebid: EBID, eventName: E['name']) => Promise<E>
  observe: <E extends Event>(
    ebid: EBID,
    eventName: E['name']
  ) => AsyncGenerator<{ stop: () => void; data: E }, void, unknown>
  tx: (ebid: EBID) => Promise<EBID>
  commit: (ebid: EBID) => Promise<EBID>
  rollback: (ebid: EBID) => Promise<EBID>
}

export type EventBus<EBID extends Record<any, any> = any> = {
  data: EBID
  behaviour: EventBusImplBehaviour<EBID>
}

export const create = <EBID>(data: EBID, behaviour: EventBusImplBehaviour<EBID>): EventBus<EBID> => {
  return {
    data,
    behaviour
  }
}

export const subscribe = async <E extends Event>(
  eb: EventBus,
  eventName: E['name'],
  eventHandler: FullEventHandler<FullEvent<E>>
): Promise<EventBus> => {
  return {
    ...eb,
    data: await eb.behaviour.subscribe(eb.data, eventName, eventHandler)
  }
}

export const unsubscribe = async <E extends Event>(
  eb: EventBus,
  eventName: E['name'],
  eventHandler: FullEventHandler<FullEvent<E>>
): Promise<EventBus> => {
  return {
    ...eb,
    data: await eb.behaviour.unsubscribe(eb.data, eventName, eventHandler)
  }
}

export const publish = async (eb: EventBus, events: readonly FullEvent[]): Promise<EventBus> => {
  await eb.behaviour.publish(eb.data, events)

  return {
    ...eb
  }
}

export const pull = <E extends Event>(eb: EventBus, eventName: E['name']): Promise<E> => {
  return eb.behaviour.pull(eb.data, eventName)
}

export const observe = <E extends Event>(
  eb: EventBus,
  eventName: E['name']
): AsyncGenerator<{ stop: () => void; data: E }, void, unknown> => {
  return eb.behaviour.observe(eb.data, eventName)
}

export const tx = async (eb: EventBus): Promise<EventBus> => {
  return {
    ...eb,
    data: await eb.behaviour.tx(eb.data)
  }
}

export const commit = async (eb: EventBus): Promise<EventBus> => {
  return {
    ...eb,
    data: await eb.behaviour.commit(eb.data)
  }
}

export const rollback = async (eb: EventBus): Promise<EventBus> => {
  return {
    ...eb,
    data: await eb.behaviour.rollback(eb.data)
  }
}

export const EventBus = {
  create,
  subscribe,
  unsubscribe,
  publish,
  pull,
  observe,
  tx,
  commit,
  rollback
}
