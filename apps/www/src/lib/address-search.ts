export default async function fetchProperties(params: string) {
  if (!params) return
  const response = await fetch(
    `https://ws.geonorge.no/adresser/v1/sok?sok=${params}&treffPerSide=50&side=0`,
  )
  const data = await response.json()

  return data
}
