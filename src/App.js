import React, { useEffect, useState, useRef } from 'react';
import {
    Box, Heading, Text, Flex, VStack, Badge, Tabs, TabList, TabPanels, Tab, TabPanel, Spinner, SimpleGrid
} from '@chakra-ui/react';
import Select from 'react-select';

const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbzJUOsXW3N2frlQzH0fbnYwCigu9relwGZqLAKhP3o9-zGjCVgHE3AgphyBHNKOTGWy/exec';

function App() {
    const [data, setData] = useState(null);
    const [loggedInName, setLoggedInName] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const [group, setGroup] = useState("boys");

    const prayerRef = useRef();
    const taraweehRef = useRef();
    const qiyamRef = useRef();
    const fullRef = useRef();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const selectedGroup = urlParams.get("group");
        if (selectedGroup === "girls") setGroup("girls");
    }, []);

    useEffect(() => {
        fetch(SHEET_API_URL)
            .then(res => res.json())
            .then(setData)
            .catch(err => console.error('Failed to fetch data:', err));
    }, []);

    useEffect(() => {
        if (!data || !loggedInName) return;

        const scrollToName = (ref, section) => {
            const element = document.getElementById(`user-${section}-${loggedInName}`);
            if (element && ref.current) {
                ref.current.scrollTop = element.offsetTop - ref.current.offsetTop;
            }
        };

        scrollToName(fullRef, 'full');
    }, [data, loggedInName]);

    useEffect(() => {
        if (!data || !loggedInName) return;

        const scrollToName = (ref, section) => {
            setTimeout(() => {
                const element = document.getElementById(`user-${section}-${loggedInName}`);
                if (element && ref.current) {
                    ref.current.scrollTop = element.offsetTop - ref.current.offsetTop;
                }
            }, 100);
        };

        if (tabIndex === 0) scrollToName(fullRef, 'full');
        if (tabIndex === 1) {
            scrollToName(prayerRef, 'prayer');
            scrollToName(taraweehRef, 'taraweeh');
            scrollToName(qiyamRef, 'qiyam');
        }
    }, [tabIndex, data, loggedInName]);

    if (!data) {
        return (
            <Flex justify="center" align="center" minH="100vh" bg="green.50">
                <Spinner size="xl" color="green.500" />
            </Flex>
        );
    }

    const selected = group === "girls" ? data.GirlsData : data.BoysData;

    const prayerRanks = selected?.ranks?.prayer || [];
    const taraweehRanks = selected?.ranks?.taraweeh || [];
    const qiyamRanks = selected?.ranks?.qiyam || [];

    const allNames = Object.keys(selected?.stats || {});
    const options = allNames.map(name => ({ label: name, value: name }));

    if (!loggedInName) {
        return (
            <Flex justify="center" align="center" minH="100vh" bg="green.50" flexDir="column" p={8}>
                <Heading color="green.700" mb={4}>Enter Your Name</Heading>
                <Box w="100%" maxW="400px">
                    <Select
                        options={options}
                        onChange={(e) => setLoggedInName(e.value)}
                        placeholder="Start typing your name..."
                    />
                </Box>
            </Flex>
        );
    }

    const points = selected.points[loggedInName] || {};
    const stats = selected.stats[loggedInName] || {};

    const getRankAbove = (ranks) => {
        const index = ranks.findIndex(p => p.name === loggedInName);
        return index > 0 ? ranks[index - 1] : null;
    };

    const RankList = ({ ranks, section, scrollRef }) => (
        <Box bg="white" borderRadius="xl" shadow="md" p={4} maxH="250px" overflowY="auto" ref={scrollRef} mb={2}>
            <VStack align="stretch" spacing={3}>
                {ranks.map((entry, index) => (
                    <Flex
                        key={entry.name + section}
                        id={`user-${section}-${entry.name}`}
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
    );

    const StatsBox = ({ stats }) => (
        <SimpleGrid columns={[1, 2]} spacing={3}>
            <Stat label="Days Filled" value={stats?.daysFilled || 0} />
            <Stat label="Days On Time" value={stats?.onTime || 0} />
            <Stat label="Total Rikaat" value={stats?.rikaat || 0} />
            <Stat label="Takbeerat Ihram" value={stats?.ihram || 0} />
            <Stat label="VIP Rikaat" value={stats?.vip || 0} />
        </SimpleGrid>
    );

    const Stat = ({ label, value }) => (
        <Box bg="gray.100" p={4} borderRadius="md" textAlign="center">
            <Text fontWeight="semibold" fontSize="md">{label}</Text>
            <Text mt={1} fontSize="2xl" fontWeight="bold" color="green.700">{value}</Text>
        </Box>
    );

    const prayerAbove = getRankAbove(prayerRanks);
    const taraweehAbove = getRankAbove(taraweehRanks);
    const qiyamAbove = getRankAbove(qiyamRanks);
    const fullRanks = Object.entries(selected.points || {})
        .map(([name, p]) => ({ name, points: p.totalPoints || 0 }))
        .sort((a, b) => b.points - a.points);
    const fullAbove = getRankAbove(fullRanks);

    return (
        <Box p={6} bg="green.50" minH="100vh">
            <Heading color="green.700" textAlign="center" mb={2}>🏆 Leaderboard ({group === 'girls' ? 'Girls' : 'Boys'})</Heading>
            <Text fontSize="xl" textAlign="center" color="green.800" mb={4}>
                Total Points: <strong>{points.totalPoints}</strong>
            </Text>

            <Tabs
                variant="enclosed"
                colorScheme="green"
                isFitted
                defaultIndex={0}
                index={tabIndex}
                onChange={(index) => setTabIndex(index)}
            >
                <TabList mb={6}>
                    <Tab>Full Leaderboard</Tab>
                    <Tab>Prayer</Tab>
                    <Tab>I3tikaf</Tab>
                    <Tab>Sulam</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Heading size="md" color="green.800" mb={2}>🌍 Total Points Leaderboard</Heading>
                        <RankList ranks={fullRanks} section="full" scrollRef={fullRef} />
                        {fullAbove && (
                            <Text textAlign="center" color="green.700" fontSize="md" mb={6}>
                                You’re 💥 {fullAbove.points - points.totalPoints} points away from <strong>{fullAbove.name}</strong>!
                            </Text>
                        )}
                    </TabPanel>

                    <TabPanel>
                        <Text fontSize="lg" textAlign="center" color="green.800" mb={4}>
                            Total Salah Points: <strong>{points.prayerPoints}</strong>
                        </Text>
                        <Heading size="md" color="green.800" mb={2}>🕌 Prayer Leaderboard</Heading>
                        <RankList ranks={prayerRanks} section="prayer" scrollRef={prayerRef} />
                        {prayerAbove && (
                            <Text textAlign="center" color="green.700" fontSize="md" mb={6}>
                                You’re 🔥 {prayerAbove.points - points.prayerPoints} points away from <strong>{prayerAbove.name}</strong>!
                            </Text>
                        )}

                        <Flex mt={10} gap={4} direction={['column', 'column', 'row']}>
                            <Box flex="1">
                                <Heading size="md" color="green.800" mb={2}>🌙 Taraweeh</Heading>
                                <RankList ranks={taraweehRanks} section="taraweeh" scrollRef={taraweehRef} />
                                {taraweehAbove && (
                                    <Text textAlign="center" color="green.600" fontSize="sm" mb={4}>
                                        You’re 🌟 {taraweehAbove.points - points.taraweehPoints} pts away from <strong>{taraweehAbove.name}</strong>
                                    </Text>
                                )}
                                <Heading size="sm" color="green.600" mb={2}>📊 Taraweeh Stats</Heading>
                                <StatsBox stats={stats.taraweeh} />
                            </Box>

                            <Box w="1px" bg="green.200" display={['none', 'none', 'block']} />

                            <Box flex="1">
                                <Heading size="md" color="green.800" mb={2}>🌌 Qiyam</Heading>
                                <RankList ranks={qiyamRanks} section="qiyam" scrollRef={qiyamRef} />
                                {qiyamAbove && (
                                    <Text textAlign="center" color="green.600" fontSize="sm" mb={4}>
                                        You’re 🌙 {qiyamAbove.points - points.qiyamPoints} pts away from <strong>{qiyamAbove.name}</strong>
                                    </Text>
                                )}
                                <Heading size="sm" color="green.600" mb={2}>📊 Qiyam Stats</Heading>
                                <StatsBox stats={stats.qiyam} />
                            </Box>
                        </Flex>
                    </TabPanel>

                    <TabPanel><Text>Coming soon inshaAllah!</Text></TabPanel>
                    <TabPanel><Text>Coming soon inshaAllah!</Text></TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
}

export default App;
