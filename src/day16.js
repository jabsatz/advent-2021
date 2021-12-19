const _ = require('lodash/fp');

const parseHex = hex =>
  hex
    .split('')
    .map((char, i) => parseInt(char, 16).toString(2).padStart(4, '0'))
    .join('');

const parsePacket = input => {
  const version = parseInt(input.substring(0, 3), 2);
  const packetTypeId = parseInt(input.substring(3, 6), 2);
  if (packetTypeId === 4) {
    let length = 6;
    const content = input.substring(6);
    let numberBits = '';
    for (let i = 0; i < content.length; i += 5) {
      length += 5;
      numberBits += content.substring(i + 1, i + 5);
      if (content[i] === '0') break;
    }
    const number = parseInt(numberBits, 2);
    return { version, packetTypeId, number, length };
  }
  const lengthTypeId = parseInt(input[6], 2);
  const contentStartIndex = 7 + (lengthTypeId === 0 ? 15 : 11);
  const packetsLength = parseInt(input.substring(7, contentStartIndex), 2);
  const content = input.substring(contentStartIndex);
  let subPackets = [];
  if (lengthTypeId === 0) {
    for (
      let pos = 0;
      _.sum(subPackets.map(packet => packet.length)) < packetsLength;
      pos += _.last(subPackets).length
    ) {
      subPackets.push(parsePacket(content.substring(pos)));
    }
  } else {
    for (let i = 0; subPackets.length < packetsLength; i++) {
      const pos = _.sum(subPackets.map(packet => packet.length));
      subPackets.push(parsePacket(content.substring(pos)));
    }
  }

  return {
    version,
    packetTypeId,
    lengthTypeId,
    length: contentStartIndex + _.sum(subPackets.map(packet => packet.length)),
    packetsLength,
    subPackets,
  };
};

const getVersionSum = packet => {
  if (packet.subPackets) {
    return packet.version + _.sum(packet.subPackets.map(getVersionSum));
  } else {
    return packet.version;
  }
};

const part1 = input => {
  const binaryInput = parseHex(input);
  const packet = parsePacket(binaryInput);
  return getVersionSum(packet);
};

const operationMap = {
  // sum
  0: packets => packets.reduce((acc, packet) => acc + packet.number, 0),
  // product
  1: packets => packets.reduce((acc, packet) => acc * packet.number, 1),
  // min
  2: packets => packets.reduce((acc, packet) => Math.min(acc, packet.number), Infinity),
  // max
  3: packets => packets.reduce((acc, packet) => Math.max(acc, packet.number), -Infinity),
  // gt
  5: packets => (packets[0].number > packets[1].number ? 1 : 0),
  // lt
  6: packets => (packets[0].number < packets[1].number ? 1 : 0),
  // eq
  7: packets => (packets[0].number === packets[1].number ? 1 : 0),
};

const processPacket = packet => {
  if (_.isNumber(packet.number)) return packet;
  const canCalculate = packet.subPackets.every(packet => _.isNumber(packet.number));
  if (canCalculate)
    return { ...packet, number: operationMap[packet.packetTypeId](packet.subPackets) };

  const calculatedPackets = packet.subPackets.map(packet => processPacket(packet));
  return {
    ...packet,
    subPackets: calculatedPackets,
    number: operationMap[packet.packetTypeId](calculatedPackets),
  };
};

const part2 = input => {
  const binaryInput = parseHex(input);
  const packet = parsePacket(binaryInput);
  const calculatedPacket = processPacket(packet);
  return calculatedPacket.number;
};

module.exports = { part1, part2 };
