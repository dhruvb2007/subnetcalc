document.addEventListener("DOMContentLoaded", function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const ip = urlParams.get('ip');
    const subnets = urlParams.get('subnets');

    if (!isValidIP(ip)) {
        document.getElementById('inputValues').innerHTML = '<p class="text-red-500">Invalid IP address format</p>';
        return;
    }

    // Step 1: Display input values
    const ipBinary = ipToBinary(ip);
    document.getElementById('inputValues').innerHTML = `
        <p><span class="font-medium">IP Address:</span> ${ip}</p>
        <p><span class="font-medium">Binary:</span> ${ipBinary}</p>
        <p><span class="font-medium">Total Subnets Required:</span> ${subnets}</p>
    `;

    // Step 2: IP Class and Default Mask
    const ipClass = getIPClass(ip);
    const defaultMask = getDefaultMask(ipClass);
    const defaultMaskBinary = getBinaryMask(defaultMask);
    const defaultMaskDecimal = binaryToIP(defaultMaskBinary);
    document.getElementById('ipClassInfo').innerHTML = `
        <p><span class="font-medium">IP Class:</span> ${ipClass}</p>
        <p><span class="font-medium">Default Mask:</span> /${defaultMask}</p>
        <p><span class="font-medium">Default Mask Binary:</span> ${defaultMaskBinary}</p>
        <p><span class="font-medium">Decimal:</span> ${defaultMaskDecimal}</p>
    `;

    // Step 3: Subnet Bits Calculation
    const requiredBits = Math.ceil(Math.log2(parseInt(subnets)));
    document.getElementById('subnetBits').innerHTML = `
        <p>Formula: 2^n >= ${subnets}</p>
        <p>n = ${requiredBits}</p>
        <p>We need to borrow ${requiredBits} bits from the host portion</p>
    `;

    // Step 4: New Subnet Mask
    const newMask = defaultMask + requiredBits;
    const newMaskBinary = getBinaryMask(newMask);
    const newMaskDecimal = binaryToIP(newMaskBinary);
    document.getElementById('newSubnetMask').innerHTML = `
        <p><span class="font-medium">New Subnet Mask:</span> /${newMask}</p>
        <p><span class="font-medium">Binary:</span> ${newMaskBinary}</p>
        <p><span class="font-medium">Decimal:</span> ${newMaskDecimal}</p>
    `;

    // Step 5: Network Address Calculation
    const networkAddress = calculateNetworkAddress(ipBinary, newMaskBinary);
    const ipOctets = ipBinary.split(' ');
    const maskOctets = newMaskBinary.split(' ');
    const resultOctets = networkAddress.split(' ');
    
    document.getElementById('networkCalc').innerHTML = `
        <div class="space-y-4">
            <table class="w-full">
                <tr>
                    <td class="py-1"><span class="font-medium">IP Address:</span></td>
                    <td class="py-1">${ipOctets[0]}</td>
                    <td class="py-1">${ipOctets[1]}</td>
                    <td class="py-1">${ipOctets[2]}</td>
                    <td class="py-1">${ipOctets[3]}</td>
                </tr>
                <tr>
                    <td class="py-1"><span class="font-medium">Subnet Mask:</span></td>
                    <td class="py-1">${maskOctets[0]}</td>
                    <td class="py-1">${maskOctets[1]}</td>
                    <td class="py-1">${maskOctets[2]}</td>
                    <td class="py-1">${maskOctets[3]}</td>
                </tr>
                <tr>
                    <td class="py-1"><span class="font-medium">AND Operation:</span></td>
                    <td class="py-1">${resultOctets[0]}</td>
                    <td class="py-1">${resultOctets[1]}</td>
                    <td class="py-1">${resultOctets[2]}</td>
                    <td class="py-1">${resultOctets[3]}</td>
                </tr>
            </table>
            <p><span class="font-medium">Network Address:</span> ${binaryToIP(networkAddress)}</p>
        </div>
    `;

    // Step 6: Network Details
    const broadcastAddress = calculateBroadcastAddress(networkAddress, newMask);
    const firstUsableIP = calculateFirstUsableIP(networkAddress);
    const lastUsableIP = calculateLastUsableIP(networkAddress, newMask);
    const totalHosts = Math.pow(2, 32 - newMask) - 2;
    const subnetSize = Math.pow(2, 32 - newMask);
    const nextSubnetNetwork = parseInt(networkAddress.replace(/\s/g, ''), 2) + subnetSize;
    const nextSubnetBinary = nextSubnetNetwork.toString(2).padStart(32, '0');
    
    document.getElementById('networkDetails').innerHTML = `
        <div class="space-y-4">
            <table class="w-full">
                <tr>
                    <td class="py-2"><span class="font-medium">Subnet Mask:</span></td>
                    <td class="py-2">${ip}/${newMask} (${binaryToIP(newMaskBinary)})</td>
                </tr>
                <tr>
                    <td class="py-2"><span class="font-medium">First Subnet Address:</span></td>
                    <td class="py-2">${binaryToIP(networkAddress)}</td>
                </tr>
                <tr>
                    <td class="py-2"><span class="font-medium">First Usable IP:</span></td>
                    <td class="py-2">${binaryToIP(firstUsableIP)}</td>
                </tr>
                <tr>
                    <td class="py-2"><span class="font-medium">Last Usable IP:</span></td>
                    <td class="py-2">${binaryToIP(lastUsableIP)}</td>
                </tr>
                <tr>
                    <td class="py-2"><span class="font-medium">First Subnet Broadcast Address:</span></td>
                    <td class="py-2">${binaryToIP(broadcastAddress)}</td>
                </tr>
                <tr>
                    <td class="py-2"><span class="font-medium">Next Subnet ID:</span></td>
                    <td class="py-2">${binaryToIP(nextSubnetBinary)}</td>
                </tr>
                <tr>
                    <td class="py-2"><span class="font-medium">Total Hosts per Subnet:</span></td>
                    <td class="py-2">${subnetSize}</td>
                </tr>
                <tr>
                    <td class="py-2"><span class="font-medium">Total Usable Hosts per Subnet:</span></td>
                    <td class="py-2">${totalHosts}</td>
                </tr>
                <tr>
                    <td class="py-2"><span class="font-medium">Total Subnets:</span></td>
                    <td class="py-2">${Math.pow(2, requiredBits)}</td>
                </tr>
            </table>
        </div>
    `;

    // Step 7: Subnet Ranges
    const subnetRanges = generateSubnetRanges(networkAddress, newMask, Math.pow(2, requiredBits));
    document.getElementById('subnetRanges').innerHTML = `
        <div class="overflow-x-auto">
            <table class="min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="border border-gray-300 px-4 py-2">Subnet</th>
                        <th class="border border-gray-300 px-4 py-2">Subnet Address</th>
                        <th class="border border-gray-300 px-4 py-2">First Host</th>
                        <th class="border border-gray-300 px-4 py-2">Last Host</th>
                        <th class="border border-gray-300 px-4 py-2">Broadcast Address</th>
                    </tr>
                </thead>
                <tbody>
                    ${subnetRanges.map((range, index) => `
                        <tr class="hover:bg-gray-50">
                            <td class="border border-gray-300 px-4 py-2 text-center">${index + 1}</td>
                            <td class="border border-gray-300 px-4 py-2">${binaryToIP(range.network)}</td>
                            <td class="border border-gray-300 px-4 py-2">${binaryToIP(range.firstUsable)}</td>
                            <td class="border border-gray-300 px-4 py-2">${binaryToIP(range.lastUsable)}</td>
                            <td class="border border-gray-300 px-4 py-2">${binaryToIP(range.broadcast)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
});

function isValidIP(ip) {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    return parts.every(part => {
        const num = parseInt(part);
        return num >= 0 && num <= 255;
    });
}

function ipToBinary(ip) {
    return ip.split('.').map(part => parseInt(part).toString(2).padStart(8, '0')).join(' ');
}

function getIPClass(ip) {
    const firstOctet = parseInt(ip.split('.')[0]);
    if (firstOctet >= 0 && firstOctet <= 127) return 'A';
    if (firstOctet >= 128 && firstOctet <= 191) return 'B';
    if (firstOctet >= 192 && firstOctet <= 223) return 'C';
    if (firstOctet >= 224 && firstOctet <= 239) return 'D';
    return 'E';
}

function getDefaultMask(ipClass) {
    switch(ipClass) {
        case 'A': return 8;
        case 'B': return 16;
        case 'C': return 24;
        default: return 24; // Default to Class C
    }
}

function getBinaryMask(mask) {
    const binary = '1'.repeat(mask).padEnd(32, '0');
    return binary.match(/.{8}/g).join(' ');
}

function calculateNetworkAddress(ipBinary, maskBinary) {
    // Split both binary strings into octets
    const ipOctets = ipBinary.split(' ');
    const maskOctets = maskBinary.split(' ');
    
    // Perform AND operation on each octet separately
    const resultOctets = ipOctets.map((ipOctet, index) => {
        const ipNum = parseInt(ipOctet, 2);
        const maskNum = parseInt(maskOctets[index], 2);
        const result = ipNum & maskNum;
        // Convert to binary and ensure exactly 8 bits with proper formatting
        return result.toString(2).padStart(8, '0').replace(/(.{8})/g, '$1');
    });
    
    console.log(resultOctets);
    // Join the octets with spaces
    return resultOctets.join(' ');
}

function calculateBroadcastAddress(networkAddress, mask) {
    // Split network address into octets
    const octets = networkAddress.split(' ');
    const hostBits = 32 - mask;
    const lastOctetHostBits = Math.min(hostBits, 8);
    
    // Calculate the host mask for the last octet
    const hostMask = (1 << lastOctetHostBits) - 1;
    
    // Convert last octet to number and apply mask
    const lastOctet = parseInt(octets[3], 2);
    const broadcastLastOctet = lastOctet | hostMask;
    
    // Keep first three octets unchanged
    return `${octets[0]} ${octets[1]} ${octets[2]} ${broadcastLastOctet.toString(2).padStart(8, '0')}`;
}

function calculateFirstUsableIP(networkAddress) {
    // Split network address into octets
    const octets = networkAddress.split(' ');
    
    // Convert last octet to number and add 1
    const lastOctet = parseInt(octets[3], 2);
    const firstUsableLastOctet = lastOctet + 1;
    
    // Keep first three octets unchanged
    return `${octets[0]} ${octets[1]} ${octets[2]} ${firstUsableLastOctet.toString(2).padStart(8, '0')}`;
}

function calculateLastUsableIP(networkAddress, mask) {
    // Split network address into octets
    const octets = networkAddress.split(' ');
    const hostBits = 32 - mask;
    const lastOctetHostBits = Math.min(hostBits, 8);
    
    // Calculate the host mask for the last octet
    const hostMask = (1 << lastOctetHostBits) - 1;
    
    // Convert last octet to number and apply mask - 1
    const lastOctet = parseInt(octets[3], 2);
    const lastUsableLastOctet = lastOctet | (hostMask - 1);
    
    // Keep first three octets unchanged
    return `${octets[0]} ${octets[1]} ${octets[2]} ${lastUsableLastOctet.toString(2).padStart(8, '0')}`;
}

function binaryToIP(binary) {
    // Remove any spaces from the binary string
    const cleanBinary = binary.replace(/\s/g, '');
    // Split into 8-bit chunks and convert each to decimal
    return cleanBinary.match(/.{8}/g).map(byte => parseInt(byte, 2)).join('.');
}

function generateSubnetRanges(networkAddress, mask, totalSubnets) {
    const hostBits = 32 - mask;
    const subnetSize = Math.pow(2, hostBits);
    const ranges = [];
    
    // Convert initial network address to number
    const initialNetwork = parseInt(networkAddress.replace(/\s/g, ''), 2);
    
    for (let i = 0; i < totalSubnets; i++) {
        // Calculate network address for this subnet
        const subnetNetwork = initialNetwork + (i * subnetSize);
        const subnetNetworkBinary = subnetNetwork.toString(2).padStart(32, '0');
        
        // Calculate broadcast address (network address + subnet size - 1)
        const broadcastAddress = subnetNetwork + subnetSize - 1;
        const broadcastBinary = broadcastAddress.toString(2).padStart(32, '0');
        
        // Calculate first usable IP (network address + 1)
        const firstUsableIP = subnetNetwork + 1;
        const firstUsableBinary = firstUsableIP.toString(2).padStart(32, '0');
        
        // Calculate last usable IP (broadcast address - 1)
        const lastUsableIP = broadcastAddress - 1;
        const lastUsableBinary = lastUsableIP.toString(2).padStart(32, '0');
        
        ranges.push({
            network: subnetNetworkBinary,
            broadcast: broadcastBinary,
            firstUsable: firstUsableBinary,
            lastUsable: lastUsableBinary
        });
    }
    
    return ranges;
}

function binaryWithSpacesToDecimal(binaryWithSpaces) {
    // Remove spaces and convert to decimal
    return parseInt(binaryWithSpaces.replace(/\s/g, ''), 2);
}
