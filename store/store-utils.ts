type StoreSetter<TState> = (
  partial: Partial<TState> | ((state: TState) => Partial<TState>),
) => void;

type LoadingState<TKey extends string> = {
  loading: Record<TKey, boolean>;
};

export function createStoreLoadingState<TKey extends string>(
  keys: readonly TKey[],
): Record<TKey, boolean> {
  return Object.fromEntries(keys.map(key => [key, false])) as Record<
    TKey,
    boolean
  >;
}

export function setStoreLoading<
  TAction extends string,
  TState extends LoadingState<TAction>,
>(
  set: StoreSetter<TState>,
  action: TAction,
  isLoading: boolean,
  patch?: Partial<Omit<TState, "loading">>,
) {
  set(state => ({
    ...patch,
    loading: { ...state.loading, [action]: isLoading },
  }) as Partial<TState>);
}
