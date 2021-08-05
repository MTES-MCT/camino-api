const ordreUpdate = async <I extends { id: string; ordre: number }, O>(
  element: I,
  elements: I[],
  update: (id: string, props: Partial<I>) => Promise<O>
) => {
  const elementOld = elements.find(d => d.id === element.id)

  // l'ordre augmente
  if (elementOld && element.ordre > elementOld.ordre) {
    const elementsModified = elements.filter(
      d => d.ordre > elementOld.ordre && d.ordre <= element.ordre!
    )

    for (const d of elementsModified) {
      await update(d.id!, { ordre: d.ordre - 1 } as Partial<I>)
    }
  }
  // l'ordre diminue
  else if (elementOld && element.ordre < elementOld.ordre) {
    const elementsModified = elements.filter(
      d => d.ordre < elementOld.ordre && d.ordre >= element.ordre!
    )

    for (const d of elementsModified) {
      await update(d.id!, { ordre: d.ordre + 1 } as Partial<I>)
    }
  }
}

const ordreFix = async <I extends { id: string; ordre: number }, O>(
  elements: I[],
  update: (id: string, props: Partial<I>) => Promise<O>
) => {
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]

    if (element.ordre !== i + 1) {
      await update(element.id!, { ordre: i + 1 } as Partial<I>)
    }
  }
}

export { ordreUpdate, ordreFix }
