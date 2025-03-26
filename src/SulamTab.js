import React, { useEffect, useRef } from 'react';
import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react';

function SulamTab({ ranks, stats, loggedInName }) {
    const sulamRef = useRef();

    useEffect(() => {
        const scrollToName = () => {
            setTimeout(() => {
                const element = document.getElementById(`user-sulam-${loggedInName}`);
                if (element && sulamRef.current) {
                    sulamRef.current.scrollTop = element.offsetTop - sulamRef.current.offsetTop;
                }
            }, 100);
        };
        scrollToName();
    }, [loggedInName, ranks]);

    const completed = stats?.completed || 0;
    const inProgress = stats?.inProgress || 0;

    const milestones = [15, 20, 30, 40];
    const nextMilestone = milestones.find(m => m > completed) || milestones[milestones.length - 1];
    const pagesToGo = Math.max(0, nextMilestone - completed);

    return (
        <Box>
            <Heading size="lg" color="green.800" mb={4}>📚 Sulam Progress</Heading>

            <Flex justify="center" align="center" direction="column" mb={6}>
                <Text fontSize="6xl" fontWeight="bold" color="green.700">
                    {completed}<Text as="span" fontSize="2xl"> / {nextMilestone}</Text>
                </Text>
                <Text color="green.600" fontSize="lg">Fully Completed Sulams</Text>
                <Text color="gray.600" fontSize="sm">You need {pagesToGo} more to reach your next milestone</Text>
                <Text color="gray.700" mt={2} fontSize="sm">
                    In Progress (includes completed): <strong>{inProgress}</strong>
                </Text>
            </Flex>

            <Heading size="md" color="green.800" mb={2}>🏅 Sulam Leaderboard</Heading>
            <Box bg="white" borderRadius="xl" shadow="md" p={4} maxH="250px" overflowY="auto" ref={sulamRef}>
                <VStack align="stretch" spacing={3}>
                    {ranks.map((entry, index) => (
                        <Flex
                            key={entry.name}
                            id={`user-sulam-${entry.name}`}
                            p={2}
                            bg={entry.name === loggedInName ? 'green.100' : 'gray.50'}
                            borderRadius="md"
                            justify="space-between"
                            fontWeight={entry.name === loggedInName ? 'bold' : 'normal'}
                        >
                            <Text>{index + 1}. {entry.name}</Text>
                            <Text>{entry.points} pages</Text>
                        </Flex>
                    ))}
                </VStack>
            </Box>
        </Box>
    );
}

export default SulamTab;
