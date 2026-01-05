"use client";

import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from 'next-themes';
import { useContributionStats } from '@/hooks/query/dashboard';

const ContributionGraph = () => {
    const { theme } = useTheme();
    const { data, isPending } = useContributionStats();

    if (isPending) {
        return (
            <div className='w-full flex flex-col items-center justify-center p-8'>
                <div className='animate-pulse text-muted-foreground'>Loading Contribution data...</div>
            </div>
        )
    };

    if (!data || !data.contributions.length) {
        return (
            <div className="w-full flex flex-col items-center justify-center p-8">
                <div className="text-muted-foreground">No contribution data available</div>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col items-center gap-4 p-4">
            <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{data.totalContributions} Contributions in this year</span>
            </div>

            <div className="w-full overflow-x-auto">
                <div className="flex justify-center min-w-max px-4">
                    <ActivityCalendar
                        data={data.contributions}
                        colorScheme={theme === "dark" ? "dark" : "light"}
                        blockSize={11}
                        blockMargin={4}
                        fontSize={14}
                        showWeekdayLabels
                        showMonthLabels
                    // theme={{
                    //     light: {},

                    // }}
                    />
                </div>
            </div>
        </div >
    )
}

export default ContributionGraph;