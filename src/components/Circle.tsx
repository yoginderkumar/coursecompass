import React, { useState } from "react";
import { Box } from "./Box";
import { Text } from "./Text";
import { COLORS, SIZES } from "./css/theme";
import { getColorForString } from "generate-colors";
import { Optional } from "utility-types";

export function Circle({
  size = "8",
  color = "textPrimary",
  style,
  children,
  className,
  backgroundColor = "surfacePrimaryLowest",
}: {
  size?: keyof typeof SIZES;
  color?: keyof typeof COLORS;
  backgroundColor?: keyof typeof COLORS;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <Box>
      <Box
        width={size}
        height={size}
        rounded="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color={color}
        backgroundColor={backgroundColor}
        style={style}
        className={className}
      >
        {children}
      </Box>
    </Box>
  );
}

export function Avatar({
  id,
  initials,
  image,
  fontSize = "b1",
  ...rest
}: React.ComponentProps<typeof Circle> &
  Optional<React.ComponentProps<typeof Text>, "fontSize"> & {
    id: string;
    initials?: string;
    image?: string;
  }) {
  const [r, g, b] = getColorForString(id);
  const [img, setImg] = useState<string | undefined>(image);
  return (
    <Circle style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, 1)` }} {...rest}>
      {img?.length ? (
        <img
          src={img}
          onError={() => {
            setImg(undefined);
          }}
          alt={initials}
          className="rounded-full"
        />
      ) : (
        <Text fontSize={fontSize} textTransform="uppercase" color="white">
          {initials}
        </Text>
      )}
    </Circle>
  );
}
