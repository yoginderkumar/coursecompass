import React from "react";
import { Box } from "./Box";

type SkeletonProps = {
  width?: React.ComponentProps<typeof Box>["width"];
  height?: React.ComponentProps<typeof Box>["height"];
  backgroundColor?: React.ComponentProps<typeof Box>["backgroundColor"];
};

export function SkeletonTitle({
  width,
  height,
  backgroundColor,
}: SkeletonProps) {
  return (
    <Box role="status" className="animate-pulse">
      <Box
        backgroundColor={backgroundColor || "surfaceBase"}
        height={height || "2"}
        width={width || "24"}
        rounded="full"
      ></Box>
    </Box>
  );
}

type SkeletonRowsProps = SkeletonProps & {
  numOfRows: number;
  numOfCols?: number;
};
export function SkeletonRows({
  numOfCols,
  numOfRows,
  ...props
}: SkeletonRowsProps) {
  const rows = new Array(numOfRows).fill(0);
  const cols = new Array(numOfCols || numOfRows).fill(0);
  return (
    <tbody>
      {rows.map((_, i) => (
        <tr key={i}>
          {cols.map((_, i) => (
            <Box
              as="td"
              key={i}
              paddingX="3"
              paddingY="4"
              className="whitespace-pre"
            >
              <SkeletonTitle {...props} />
            </Box>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

type SkeletonBoxProps = React.ComponentProps<typeof Box>;
export function SkeletonBox({
  className,
  ...props
}: SkeletonBoxProps & { className?: string }) {
  return (
    <Box
      role="status"
      className={`animate-pulse ${className || ""}`}
      {...props}
    >
      <Box
        backgroundColor={props.backgroundColor || "surfaceBase"}
        height={props.height || "12"}
        width={props.width || "24"}
        rounded={props.rounded || "md"}
        borderWidth={props.borderWidth || "0"}
        borderColor={props.borderColor || "borderOutline"}
      ></Box>
    </Box>
  );
}

type SkeletonAvatarType = SkeletonProps & {
  size?: React.ComponentProps<typeof Box>["size"];
};
export function SkeletonAvatar({ size, ...props }: SkeletonAvatarType) {
  return (
    <Box role="status" className={`animate-pulse`}>
      <Box
        size={size || "12"}
        rounded="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor={props.backgroundColor || "surfaceBase"}
        {...props}
      ></Box>
    </Box>
  );
}
