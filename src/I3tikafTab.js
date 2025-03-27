import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

const I3tikafTab = ({ ranks, points, loggedInName }) => {
    const scrollRef = useRef();

    useEffect(() => {
        const element = document.getElementById(`user-i3tikaf-${loggedInName}`);
        if (element && scrollRef.current) {
            scrollRef.current.scrollTop = element.offsetTop - scrollRef.current.offsetTop;
        }
    }, [ranks, loggedInName]);

    const user = points?.i3tikaf || { in: 0, out: 0, total: 0 };

    return (
        <Box>
            <Heading size="md" color="green.800" mb={2}>🏕️ I3tikaf Leaderboard</Heading>
            <Box bg="white" borderRadius="xl" shadow="md" p={4} maxH="250px" overflowY="auto" ref={scrollRef} mb={4}>
                <VStack align="stretch" spacing={3}>
                    {ranks.map((entry, index) => (
                        <Flex
                            key={entry.name}
                            id={`user-i3tikaf-${entry.name}`}
                            p={2}
                            bg={entry.name === loggedInName ? 'green.100' : 'gray.50'}
                            borderRadius="md"
                            justify="space-between"
                            fontWeight={entry.name === loggedInName ? 'bold' : 'normal'}
                        >
                            <Text>{index + 1}. {entry.name}</Text>
                            <Text>{entry.points} pts</Text>
                        </Flex>
                    ))}
                </VStack>
            </Box>

            <Box bg="gray.100" borderRadius="xl" p={6} textAlign="center" shadow="sm">
                <Text fontSize="xl" mb={1} color="green.700" fontWeight="bold">
                    {user.in} <span style={{ fontSize: 'smaller' }}>(In)</span>
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="gray.600">−</Text>
                <Text fontSize="xl" mb={1} color="red.500" fontWeight="bold">
                    {user.out} <span style={{ fontSize: 'smaller' }}>(Out)</span>
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="gray.600">=</Text>
                <Text fontSize="3xl" fontWeight="extrabold" color="green.800">
                    {user.total} <span style={{ fontSize: 'lg' }}>(Total)</span>
                </Text>
            </Box>
        </Box>
    );
};

export default I3tikafTab;
