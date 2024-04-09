import { Box, BoxProps } from "./Box";

export function ProgressBar({
  percentage,
  ...props
}: BoxProps & { percentage: string }) {
  return (
    <Box
      className="w-full rounded-full h-[6px]"
      backgroundColor="surfaceNeutral"
    >
      <Box
        {...props}
        className="h-[6px] rounded-full"
        style={{ width: percentage }}
      ></Box>
    </Box>
  );
}
