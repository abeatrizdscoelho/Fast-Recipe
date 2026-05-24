import { useEffect, useState } from 'react'

export function usePortionScale(originalPortions: number) {
    const [portions, setPortions] = useState(Math.max(1, originalPortions))

    useEffect(() => {
        if (originalPortions > 1) {
            setPortions(originalPortions)
        }
    }, [originalPortions])

    const scale = portions / Math.max(1, originalPortions)

    function increment() {
        setPortions(p => p + 1)
    }

    function decrement() {
        setPortions(p => Math.max(1, p - 1))
    }

    return { portions, scale, increment, decrement }
}