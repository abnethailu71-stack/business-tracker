let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let chart = null;

window.onload = () => {
  const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
      renderAll();
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js');
              }
              };

              function addTransaction() {
                const amount = parseFloat(document.getElementById('amount').value);
                  const category = document.getElementById('category').value;
                    const notes = document.getElementById('notes').value;
                      const date = document.getElementById('date').value;

                        if (!amount || isNaN(amount)) {
                            alert('Please enter a valid amount.');
                                return;
                                  }

                                    const transaction = {
                                        id: Date.now(),
                                            amount,
                                                category,
                                                    notes,
                                                        date
                                                          };

                                                            transactions.push(transaction);
                                                              localStorage.setItem('transactions', JSON.stringify(transactions));

                                                                document.getElementById('amount').value = '';
                                                                  document.getElementById('notes').value = '';
                                                                    renderAll();
                                                                    }

                                                                    function renderAll() {
                                                                      renderList();
                                                                        renderSummary();
                                                                          renderChart();
                                                                          }

                                                                          function renderList() {
                                                                            const list = document.getElementById('transactionList');
                                                                              list.innerHTML = '';
                                                                                [...transactions].reverse().forEach(t => {
                                                                                    const li = document.createElement('li');
                                                                                        li.className = t.category;
                                                                                            li.innerHTML = `
                                                                                                  <span>${t.date} — ${t.notes || t.category}</span>
                                                                                                        <span>${t.category === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}</span>
                                                                                                            `;
                                                                                                                list.appendChild(li);
                                                                                                                  });
                                                                                                                  }

                                                                                                                  function renderSummary() {
                                                                                                                    const income = transactions
                                                                                                                        .filter(t => t.category === 'income')
                                                                                                                            .reduce((sum, t) => sum + t.amount, 0);
                                                                                                                              const expense = transactions
                                                                                                                                  .filter(t => t.category === 'expense')
                                                                                                                                      .reduce((sum, t) => sum + t.amount, 0);

                                                                                                                                        document.getElementById('totalIncome').textContent = `$${income.toFixed(2)}`;
                                                                                                                                          document.getElementById('totalExpense').textContent = `$${expense.toFixed(2)}`;
                                                                                                                                            document.getElementById('balance').textContent = `$${(income - expense).toFixed(2)}`;
                                                                                                                                            }

                                                                                                                                            function renderChart() {
                                                                                                                                              const income = transactions
                                                                                                                                                  .filter(t => t.category === 'income')
                                                                                                                                                      .reduce((sum, t) => sum + t.amount, 0);
                                                                                                                                                        const expense = transactions
                                                                                                                                                            .filter(t => t.category === 'expense')
                                                                                                                                                                .reduce((sum, t) => sum + t.amount, 0);

                                                                                                                                                                  const ctx = document.getElementById('myChart').getContext('2d');
                                                                                                                                                                    if (chart) chart.destroy();
                                                                                                                                                                      chart = new Chart(ctx, {
                                                                                                                                                                          type: 'bar',
                                                                                                                                                                              data: {
                                                                                                                                                                                    labels: ['Income', 'Expenses'],
                                                                                                                                                                                          datasets: [{
                                                                                                                                                                                                  label: 'Amount ($)',
                                                                                                                                                                                                          data: [income, expense],
                                                                                                                                                                                                                  backgroundColor: ['#2ecc71', '#e74c3c'],
                                                                                                                                                                                                                          borderRadius: 8
                                                                                                                                                                                                                                }]
                                                                                                                                                                                                                                    },
                                                                                                                                                                                                                                        options: { responsive: true, plugins: { legend: { display: false } } }
                                                                                                                                                                                                                                          });
                                                                                                                                                                                                                                          }

                                                                                                                                                                                                                                          function backupToCSV() {
                                                                                                                                                                                                                                            if (transactions.length === 0) {
                                                                                                                                                                                                                                                alert('No transactions to backup.');
                                                                                                                                                                                                                                                    return;
                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                        let csv = 'ID,Amount,Category,Notes,Date\n';
                                                                                                                                                                                                                                                          transactions.forEach(t => {
                                                                                                                                                                                                                                                              csv += `${t.id},${t.amount},${t.category},"${t.notes}",${t.date}\n`;
                                                                                                                                                                                                                                                                });
                                                                                                                                                                                                                                                                  const blob = new Blob([csv], { type: 'text/csv' });
                                                                                                                                                                                                                                                                    const url = URL.createObjectURL(blob);
                                                                                                                                                                                                                                                                      const a = document.createElement('a');
                                                                                                                                                                                                                                                                        a.href = url;
                                                                                                                                                                                                                                                                          a.download = `backup_${new Date().toISOString().split('T')[0]}.csv`;
                                                                                                                                                                                                                                                                            a.click();
                                                                                                                                                                                                                                                                            }