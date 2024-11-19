document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch("http://localhost:3001/data");
        const data = await response.json();
        let filteredData = [...data]; // Keep original data separate
        // console.log(data)
        const leaderboardBody = document.getElementById('leaderboard-body');
        const sectionFilter = document.getElementById('section-filter');

        // Populate section filter dropdown
        const populateSectionFilter = () => {
            const sections = [...new Set(data.map(student => student.section || 'N/A'))].sort();
            sectionFilter.innerHTML = '<option value="all">All Sections</option>';
            sections.forEach(section => {
                const option = document.createElement('option');
                option.value = section;
                option.textContent = section;
                sectionFilter.appendChild(option);
            });
        };

        // Function to export data to CSV
        const exportToCSV = (data) => {
            const headers = ['Rank', 'Roll Number', 'Name', 'Section', 'Total Solved', 'Easy', 'Medium', 'Hard', 'LeetCode URL'];
            const csvRows = data.map((student, index) => {
                return [
                    index + 1,
                    student.roll,
                    student.name,
                    student.section || 'N/A',
                    student.totalSolved || 'N/A',
                    student.easySolved || 'N/A',
                    student.mediumSolved || 'N/A',
                    student.hardSolved || 'N/A',
                    student.url
                ].join(',');
            });
            
            const csvContent = [headers.join(','), ...csvRows].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'leaderboard.csv');
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        // Function to render the leaderboard
        const renderLeaderboard = (sortedData) => {
            leaderboardBody.innerHTML = '';
            sortedData.forEach((student, index) => {
                const row = document.createElement('tr');
                row.id = `${student.roll}`;
                row.classList.add('border-b', 'border-gray-700');
                row.innerHTML = `
                    <td class="p-4">${index + 1}</td>
                    <td class="p-4">${student.roll}</td>
                    <td class="p-4">
                        ${student.url.startsWith('https://leetcode.com/u/') 
                            ? `<a href="${student.url}" target="_blank" class="text-blue-400">${student.name}</a>`
                            : `<div class="text-red-500">${student.name}</div>`}
                    </td>
                    <td class="p-4">${student.section || 'N/A'}</td>
                    <td class="p-4">${student.totalSolved || 'N/A'}</td>
                    <td class="p-4 text-green-400">${student.easySolved || 'N/A'}</td>
                    <td class="p-4 text-yellow-400">${student.mediumSolved || 'N/A'}</td>
                    <td class="p-4 text-red-400">${student.hardSolved || 'N/A'}</td>
                `;
                row.addEventListener('click', () => {
                    renderAgain(sortedData, student.roll);
                })
                leaderboardBody.appendChild(row);
            });
        };
        let pinned = []
        const renderAgain = (sortedData, roll) => {
            leaderboardBody.innerHTML = '';
            let index = 1;
            sortedData.forEach((student) => {
                // if(pinned.includes(roll)) {
                //     const row = document.getElementById(roll);
                //     row.classList.remove('pinned');
                // }
                if(student.roll == roll || pinned.includes(student.roll)) {
                    pinned.push(roll);
                    console.log(pinned);
                    const row = createElement(student, index++);
                    row.classList.add('pinned');
                    leaderboardBody.appendChild(row);
                }
            })
            sortedData.forEach((student) => {
                if(!pinned.includes(student.roll)) {
                    const row = createElement(student, index++);
                    // row.classList.add('pinned');
                    leaderboardBody.appendChild(row);
                    row.addEventListener('click', () => {
                        renderAgain(sortedData, student.roll);
                    })
                }
            })
        }

        const createElement = (student, index) => {
            const row = document.createElement('tr');
            row.id = `${student.roll}`;
            row.classList.add('border-b', 'border-gray-700');
            row.innerHTML = `
                <td class="p-4">${index}</td>
                <td class="p-4">${student.roll}</td>
                <td class="p-4">
                    ${student.url.startsWith('https://leetcode.com/u/') 
                        ? `<a href="${student.url}" target="_blank" class="text-blue-400">${student.name}</a>`
                        : `<div class="text-red-500">${student.name}</div>`}
                </td>
                <td class="p-4">${student.section || 'N/A'}</td>
                <td class="p-4">${student.totalSolved || 'N/A'}</td>
                <td class="p-4 text-green-400">${student.easySolved || 'N/A'}</td>
                <td class="p-4 text-yellow-400">${student.mediumSolved || 'N/A'}</td>
                <td class="p-4 text-red-400">${student.hardSolved || 'N/A'}</td>
            `;
            return row;

        }

        const compare = document.getElementById('compare');
        const dialog = document.getElementById('modal');
        const close = document.getElementById('closeModal');
        const compareModal = document.getElementById('compareModal');
        const table = document.getElementById('compareTable')
        const form = document.getElementById('form')

        compare.addEventListener('click', () => {
            dialog.showModal();
        })

        close.addEventListener('click', () => {
            form.style = 'display: block';
            table.style = 'display: none';
            dialog.close();
        })

        compareModal.addEventListener('click', (e) => {
            e.preventDefault();
            const roll1 = document.getElementById('roll1').value;
            const roll2 = document.getElementById('roll2').value;
            let d1 = {}
            let d2 = {}
            let flag = 0
            data.forEach((student) => {
                if(student.roll == roll1 || student.name == roll1.toUpperCase()) {
                    d1 = student;
                    flag++;
                }
                if(student.roll == roll2 || student.name == roll2.toUpperCase()) {
                    d2 = student;
                    flag++;
                }
            })
            if(flag != 2) {
                alert("Invalid Data. Please try again.")
                return;
            }
            console.log(d1, d2);
            document.getElementById('name1').innerText = d1.name;
            document.getElementById('total1').innerText = d1.totalSolved;
            document.getElementById('easy1').innerText = d1.easySolved;
            document.getElementById('medium1').innerText = d1.mediumSolved;
            document.getElementById('hard1').innerText = d1.hardSolved;

            document.getElementById('name2').innerText = d2.name;
            document.getElementById('total2').innerText = d2.totalSolved;
            document.getElementById('easy2').innerText = d2.easySolved;
            document.getElementById('medium2').innerText = d2.mediumSolved;
            document.getElementById('hard2').innerText = d2.hardSolved;

           
            form.style = 'display: none';
            table.style = 'display: flex';

        })


        // Filter function
        const filterData = (section) => {
            filteredData = section === 'all' 
                ? [...data]
                : data.filter(student => (student.section || 'N/A') === section);
            renderLeaderboard(filteredData);
        };

        // Sorting logic with ascending and descending functionality
        let totalSolvedDirection = 'desc';
        let easySolvedDirection = 'desc';
        let mediumSolvedDirection = 'desc';
        let hardSolvedDirection = 'desc';
        let sectionDirection = 'asc';

        const sortData = (data, field, direction, isNumeric = false) => {
            return data.sort((a, b) => {
                const valA = a[field] || (isNumeric ? 0 : 'Z');
                const valB = b[field] || (isNumeric ? 0 : 'Z');
                if (isNumeric) {
                    return direction === 'desc' ? valB - valA : valA - valB;
                } else {
                    return direction === 'desc'
                        ? valB.toString().localeCompare(valA.toString())
                        : valA.toString().localeCompare(valB.toString());
                }
            });
        };

        // Initialize the page
        populateSectionFilter();
        renderLeaderboard(data);

        // Event Listeners
        sectionFilter.addEventListener('change', (e) => {
            filterData(e.target.value);
        });

        document.getElementById('export-btn').addEventListener('click', () => {
            exportToCSV(filteredData); // Export only filtered data
        });

        document.getElementById('sort-section').addEventListener('click', () => {
            sectionDirection = sectionDirection === 'desc' ? 'asc' : 'desc';
            const sortedData = sortData(filteredData, 'section', sectionDirection, false);
            renderLeaderboard(sortedData);
        });

        document.getElementById('sort-total').addEventListener('click', () => {
            totalSolvedDirection = totalSolvedDirection === 'desc' ? 'asc' : 'desc';
            const sortedData = sortData(filteredData, 'totalSolved', totalSolvedDirection, true);
            renderLeaderboard(sortedData);
        });

        document.getElementById('sort-easy').addEventListener('click', () => {
            easySolvedDirection = easySolvedDirection === 'desc' ? 'asc' : 'desc';
            const sortedData = sortData(filteredData, 'easySolved', easySolvedDirection, true);
            renderLeaderboard(sortedData);
        });

        document.getElementById('sort-medium').addEventListener('click', () => {
            mediumSolvedDirection = mediumSolvedDirection === 'desc' ? 'asc' : 'desc';
            const sortedData = sortData(filteredData, 'mediumSolved', mediumSolvedDirection, true);
            renderLeaderboard(sortedData);
        });

        document.getElementById('sort-hard').addEventListener('click', () => {
            hardSolvedDirection = hardSolvedDirection === 'desc' ? 'asc' : 'desc';
            const sortedData = sortData(filteredData, 'hardSolved', hardSolvedDirection, true);
            renderLeaderboard(sortedData);
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    }
});