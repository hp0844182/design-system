export function useFilterPressProps<T extends object>(props:T ) {
	const newProp:any = {}
	Object.keys(props).forEach(key=>{
		if(!['onPress','onPressStart','onPressEnd','onPressChange','onPressUp'].includes(key)){
			newProp[key] = (props as any)[key]
		}
	})
	return newProp
}
