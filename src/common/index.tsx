import { Box, Inline, ProgressBar, Stack, Text } from "../components";
import {
  DesigningIcon,
  Icon,
  IconProps,
  SoftwareDevelopmentIcon,
  StarIcon,
} from "../components/Icons";
import { CategoryIds, CourseRatings } from "../data/courses";

// eslint-disable-next-line react-refresh/only-export-components
export function getCategoryIcon({
  id,
  ...props
}: IconProps & { id: CategoryIds }) {
  switch (id) {
    case "software_development":
      return <SoftwareDevelopmentIcon {...props} />;
    case "software_design":
      return <DesigningIcon {...props} />;
    default:
      return null;
  }
}

export function Stars({
  rating,
  size = "3",
}: {
  rating: number;
  size?: React.ComponentProps<typeof Icon>["size"];
}) {
  const filledStars = Math.floor(rating);
  return (
    <Inline gap="1" alignItems="center">
      {[1, 2, 3, 4, 5].map((el) => (
        <StarIcon
          size={size}
          color={
            el <= filledStars
              ? filledStars === 5
                ? "iconSuccess"
                : filledStars === 1
                ? "iconError"
                : "ratingColor"
              : "iconLow"
          }
          key={el}
        />
      ))}
    </Inline>
  );
}

export function ProgressBars({ ratings }: { ratings: CourseRatings }) {
  const summary = getRatingsSummary(ratings);
  const percentageSummary: { [key: number]: number } = {};
  Object.keys(summary).forEach((key) => {
    const numKey = Number(key);
    const numVal = summary[numKey];
    percentageSummary[numKey] = Number(
      ((numVal / ratings.length) * 100).toFixed(0)
    );
  });
  return (
    <Stack width="full" gap="2">
      {[5, 4, 3, 2, 1].map((i) => (
        <Inline key={i} gap="4" alignItems="center">
          <Inline
            gap="2"
            as="ul"
            justifyContent="end"
            width="full"
            className="max-w-[20%]"
          >
            {[...Array(i)].map((el) => (
              <StarIcon
                size="3"
                color={
                  i === 5
                    ? "iconSuccess"
                    : i === 1
                    ? "iconError"
                    : "ratingColor"
                }
                key={el}
              />
            ))}
          </Inline>
          <Box width="full" maxWidth="lg">
            <ProgressBar
              backgroundColor={
                i === 5
                  ? "surfaceSuccess"
                  : i === 1
                  ? "surfaceError"
                  : "ratingColor"
              }
              percentage={`${percentageSummary[i] || 0}%`}
            />
          </Box>
          <Box width="24">
            <Text color="textLow" className="whitespace-pre" fontSize="c1">
              {`${summary[i] || 0} | ${percentageSummary[i] || 0} %`}{" "}
            </Text>
          </Box>
        </Inline>
      ))}
    </Stack>
  );
}

function getRatingsSummary(arr: CourseRatings) {
  const summary: { [key: number]: number } = {};
  arr.forEach((el) => {
    if (summary[el.value]) {
      ++summary[el.value];
    } else {
      summary[el.value] = 1;
    }
  });
  return summary;
}
