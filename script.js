const getData = async () => {
    const data = await d3.json('https://data.lacity.org/resource/2nrs-mtv8.json');
    console.log(data);
    return data;
};

getData().then(data => {
    const crimeCounts = {};

    data.forEach(crime => {
        const crimeType = crime.crm_cd_desc;
        if (crimeType) {
            if (crimeCounts[crimeType]) {
                crimeCounts[crimeType] += 1;
            } else {
                crimeCounts[crimeType] = 1;
            }
        }
    });

    const categories = Object.keys(crimeCounts);
    const dataset = Object.values(crimeCounts);

    const svgWidth = 1000;
    const svgHeight = 1000;
    const margin = {
        top: 50,
        bottom: 480,
        right: 30,
        left: 60
    };

    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select('body')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .style('border', '2px dotted blue')
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleBand()
        .domain(categories)
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, 500])
        .range([height, 0]);

    svg.selectAll('.bar')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (data, index) => x(categories[index]))
        .attr('y', data => y(data))
        .attr('width', x.bandwidth())
        .attr('height', data => height - y(data))
        .attr('fill', 'powderblue')
        .on('mouseover', function (event, d) {
            d3.select(this).transition()
                .duration(50)
                .attr('fill', '#A50055')
                .attr('opacity', '.5');

            svg.append('text')
                .attr('class', 'hover-text')
                .attr('x', parseFloat(d3.select(this).attr('x')) + x.bandwidth() / 2)
                .attr('y', parseFloat(d3.select(this).attr('y')) - 10)
                .attr('text-anchor', 'middle')
                .style('font-family', 'Silkscreen')
                .style('font-size', '12px')
                .style('fill', 'darkblue')
                .text(d);
        })
        .on('mouseout', function (event, d) {
            d3.select(this).transition()
                .duration(50)
                .attr('fill', 'powderblue')
                .attr('opacity', '1');

            svg.selectAll('.hover-text').remove();
        });

    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-90)')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .style('text-anchor', 'end')
        .style('font-family', 'Silkscreen')
        .style('font-size', '12px')
        .style('fill', 'darkblue');

    svg.append('g')
        .call(d3.axisLeft(y))
        .selectAll('text')
        .style('font-family', 'Silkscreen')
        .style('font-size', '14px')
        .style('fill', 'darkblue');

    // Add title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .style('font-family', 'Silkscreen')
        .style('font-weight', 'bold')
        .text('Crime Types in Los Angeles (2020 - Present)');

});
