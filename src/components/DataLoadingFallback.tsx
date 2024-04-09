import { Box } from "./Box"
import { SpinnerIcon } from "./Icons"
export function DataLoadingFallback({
  label = "Loading...",
}: {
  label: string
}) {
  return (
    <Box paddingY="16" textAlign="center">
      <SpinnerIcon className="w-8 h-8 mr-4" /> {label}
    </Box>
  )
}
