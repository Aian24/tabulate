// Dynamic Invoice Data Management
class InvoiceDataManager {
  constructor() {
    this.currentDataSet = 0
    this.dataSets = [
      {
        customer: {
          name: "Paget Zowie",
          phone: "09234234234",
          email: "dabidbell5656@gmail.com",
          address: "SM Mall of Asia, Seaside Blvd",
        },
        invoiceInfo: {
          number: "1000-02",
          date: "2025-01-15",
          dueDate: "2025-01-22",
        },
        items: [
          {
            item: "Office Cleaning Package",
            qty: 1,
            unit: 300.0,
            tax: 0.0,
            discount: 0.0,
            totalAmount: 300.0,
            payment: 390.0,
            currentlyDue: 0.0,
            balance: -90.0,
          },
          {
            item: "Office Cleaning Package",
            qty: 1,
            unit: 300.0,
            tax: 0.0,
            discount: 0.0,
            totalAmount: 300.0,
            payment: 390.0,
            currentlyDue: 0.0,
            balance: -90.0,
          },
          {
            item: "Office Cleaning Package",
            qty: 1,
            unit: 300.0,
            tax: 0.0,
            discount: 0.0,
            totalAmount: 300.0,
            payment: 390.0,
            currentlyDue: 0.0,
            balance: -90.0,
          },
        ],
        unpaidInvoices: [
          {
            number: "1000-01",
            amount: 299.96,
            createdAt: "2025-03-12",
            dueDate: "2025-03-19",
          },
        ],
        totals: {
          currentInvoice: -270.0,
          unpaidInvoice: 299.96,
          total: 29.96,
        },
      },
      {
        customer: {
          name: "Sarah Johnson",
          phone: "09876543210",
          email: "sarah.johnson@techcorp.com",
          address: "123 Business District, Makati City",
        },
        invoiceInfo: {
          number: "1000-03",
          date: "2025-01-20",
          dueDate: "2025-01-27",
        },
        items: [
          {
            item: "Website Development",
            qty: 1,
            unit: 2500.0,
            tax: 300.0,
            discount: 250.0,
            totalAmount: 2550.0,
            payment: 1000.0,
            currentlyDue: 1550.0,
            balance: 1550.0,
          },
          {
            item: "SEO Optimization",
            qty: 1,
            unit: 800.0,
            tax: 96.0,
            discount: 0.0,
            totalAmount: 896.0,
            payment: 0.0,
            currentlyDue: 896.0,
            balance: 896.0,
          },
        ],
        unpaidInvoices: [
          {
            number: "1000-02",
            amount: 450.0,
            createdAt: "2025-01-10",
            dueDate: "2025-01-17",
          },
          {
            number: "1000-01",
            amount: 750.0,
            createdAt: "2025-01-05",
            dueDate: "2025-01-12",
          },
        ],
        totals: {
          currentInvoice: 2446.0,
          unpaidInvoice: 1200.0,
          total: 3646.0,
        },
      },
      {
        customer: {
          name: "Michael Chen",
          phone: "09123456789",
          email: "m.chen@globaltech.ph",
          address: "456 Innovation Hub, BGC Taguig",
        },
        invoiceInfo: {
          number: "1000-04",
          date: "2025-01-25",
          dueDate: "2025-02-01",
        },
        items: [
          {
            item: "Mobile App Development",
            qty: 1,
            unit: 5000.0,
            tax: 600.0,
            discount: 500.0,
            totalAmount: 5100.0,
            payment: 2500.0,
            currentlyDue: 2600.0,
            balance: 2600.0,
          },
          {
            item: "UI/UX Design",
            qty: 1,
            unit: 1500.0,
            tax: 180.0,
            discount: 150.0,
            totalAmount: 1530.0,
            payment: 500.0,
            currentlyDue: 1030.0,
            balance: 1030.0,
          },
          {
            item: "Testing & QA",
            qty: 1,
            unit: 800.0,
            tax: 96.0,
            discount: 0.0,
            totalAmount: 896.0,
            payment: 0.0,
            currentlyDue: 896.0,
            balance: 896.0,
          },
        ],
        unpaidInvoices: [
          {
            number: "1000-03",
            amount: 1250.0,
            createdAt: "2025-01-15",
            dueDate: "2025-01-22",
          },
        ],
        totals: {
          currentInvoice: 4526.0,
          unpaidInvoice: 1250.0,
          total: 5776.0,
        },
      },
      {
        customer: {
          name: "Lisa Rodriguez",
          phone: "09555123456",
          email: "lisa.r@creativeagency.com",
          address: "789 Creative Plaza, Quezon City",
        },
        invoiceInfo: {
          number: "1000-05",
          date: "2025-01-30",
          dueDate: "2025-02-06",
        },
        items: [
          {
            item: "Brand Identity Design",
            qty: 1,
            unit: 3000.0,
            tax: 360.0,
            discount: 300.0,
            totalAmount: 3060.0,
            payment: 3060.0,
            currentlyDue: 0.0,
            balance: 0.0,
          },
          {
            item: "Marketing Materials",
            qty: 2,
            unit: 750.0,
            tax: 180.0,
            discount: 75.0,
            totalAmount: 1605.0,
            payment: 800.0,
            currentlyDue: 805.0,
            balance: 805.0,
          },
        ],
        unpaidInvoices: [],
        totals: {
          currentInvoice: 805.0,
          unpaidInvoice: 0.0,
          total: 805.0,
        },
      },
    ]

    this.init()
  }

  init() {
    this.loadCurrentData()
    this.setupEventListeners()
  }

  setupEventListeners() {
    const changeDataBtn = document.getElementById("changeDataBtn")
    if (changeDataBtn) {
      changeDataBtn.addEventListener("click", () => {
        this.changeData()
      })
    }

    const invoiceSelect = document.getElementById("invoiceSelect")
    if (invoiceSelect) {
      invoiceSelect.addEventListener("change", (e) => {
        const selectedValue = e.target.value
        const dataIndex = this.dataSets.findIndex((data) => data.invoiceInfo.number === selectedValue)
        if (dataIndex !== -1) {
          this.currentDataSet = dataIndex
          this.loadCurrentData()
        }
      })
    }
  }

  changeData() {
    this.currentDataSet = (this.currentDataSet + 1) % this.dataSets.length
    this.loadCurrentData()
    this.updateInvoiceSelect()

    // Add visual feedback
    document.body.style.transition = "background-color 0.3s ease"
    document.body.style.backgroundColor = "#e0f2fe"
    setTimeout(() => {
      document.body.style.backgroundColor = ""
    }, 300)
  }

  updateInvoiceSelect() {
    const invoiceSelect = document.getElementById("invoiceSelect")
    if (invoiceSelect) {
      invoiceSelect.value = this.dataSets[this.currentDataSet].invoiceInfo.number
    }
  }

  loadCurrentData() {
    const data = this.dataSets[this.currentDataSet]

    // Update customer information
    this.updateCustomerInfo(data.customer)

    // Update invoice information
    this.updateInvoiceInfo(data.invoiceInfo)

    // Update invoice items
    this.updateInvoiceItems(data.items)

    // Update unpaid invoices
    this.updateUnpaidInvoices(data.unpaidInvoices)

    // Update totals
    this.updateTotals(data.totals)
  }

  updateCustomerInfo(customer) {
    const elements = {
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      customerAddress: customer.address,
    }

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id)
      if (element) {
        element.textContent = value
        this.animateElement(element)
      }
    })
  }

  updateInvoiceInfo(invoiceInfo) {
    const elements = {
      invoiceNumber: invoiceInfo.number,
      invoiceDate: invoiceInfo.date,
      dueDate: invoiceInfo.dueDate,
    }

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id)
      if (element) {
        element.value = value
        this.animateElement(element)
      }
    })
  }

  updateInvoiceItems(items) {
    const tbody = document.getElementById("invoiceItemsBody")
    if (!tbody) return

    tbody.innerHTML = ""

    let totalQty = 0
    let totalUnit = 0
    let totalTax = 0
    let totalDiscount = 0
    let totalAmount = 0
    let totalPayment = 0
    let totalCurrentlyDue = 0
    let totalBalance = 0

    items.forEach((item) => {
      const row = document.createElement("tr")
      row.className = "border-b"
      row.innerHTML = `
                <td class="px-4 py-2">${item.item}</td>
                <td class="px-4 py-2 text-center">${item.qty}</td>
                <td class="px-4 py-2 text-right">$${item.unit.toFixed(2)}</td>
                <td class="px-4 py-2 text-right">$${item.tax.toFixed(2)}</td>
                <td class="px-4 py-2 text-right">$${item.discount.toFixed(2)}</td>
                <td class="px-4 py-2 text-right">$${item.totalAmount.toFixed(2)}</td>
                <td class="px-4 py-2 text-right">$${item.payment.toFixed(2)}</td>
                <td class="px-4 py-2 text-right">
                    <input type="text" class="border rounded px-2 py-1 w-20 text-right" value="${item.currentlyDue.toFixed(2)}" />
                </td>
                <td class="px-4 py-2 text-right">$${item.balance.toFixed(2)}</td>
            `
      tbody.appendChild(row)

      totalQty += item.qty
      totalUnit += item.unit
      totalTax += item.tax
      totalDiscount += item.discount
      totalAmount += item.totalAmount
      totalPayment += item.payment
      totalCurrentlyDue += item.currentlyDue
      totalBalance += item.balance
    })

    // Add total row
    const totalRow = document.createElement("tr")
    totalRow.className = "font-bold bg-white"
    totalRow.innerHTML = `
            <td class="px-4 py-2">TOTAL</td>
            <td class="px-4 py-2 text-center">${totalQty}</td>
            <td class="px-4 py-2 text-right">$${totalUnit.toFixed(2)}</td>
            <td class="px-4 py-2 text-right">$${totalTax.toFixed(2)}</td>
            <td class="px-4 py-2 text-right">$${totalDiscount.toFixed(2)}</td>
            <td class="px-4 py-2 text-right">$${totalAmount.toFixed(2)}</td>
            <td class="px-4 py-2 text-right">$${totalPayment.toFixed(2)}</td>
            <td class="px-4 py-2 text-right">$${totalCurrentlyDue.toFixed(2)}</td>
            <td class="px-4 py-2 text-right">$${totalBalance.toFixed(2)}</td>
        `
    tbody.appendChild(totalRow)

    this.animateElement(tbody)
  }

  updateUnpaidInvoices(unpaidInvoices) {
    const tbody = document.getElementById("unpaidInvoicesBody")
    if (!tbody) return

    tbody.innerHTML = ""

    let totalAmount = 0

    unpaidInvoices.forEach((invoice) => {
      const row = document.createElement("tr")
      row.className = "border-b"
      row.innerHTML = `
                <td class="px-4 py-2 text-blue-600 underline cursor-pointer">
                    <a href="#" class="unpaid-invoice-link">${invoice.number}</a>
                </td>
                <td class="px-4 py-2 text-right">$${invoice.amount.toFixed(2)}</td>
                <td class="px-4 py-2 text-right">${invoice.createdAt}</td>
                <td class="px-4 py-2 text-right">${invoice.dueDate}</td>
            `
      tbody.appendChild(row)
      totalAmount += invoice.amount
    })

    // Add total row
    const totalRow = document.createElement("tr")
    totalRow.className = "font-bold"
    totalRow.innerHTML = `
            <td class="px-4 py-2">Total</td>
            <td class="px-4 py-2 text-right">$${totalAmount.toFixed(2)}</td>
            <td class="px-4 py-2"></td>
            <td class="px-4 py-2"></td>
        `
    tbody.appendChild(totalRow)

    this.animateElement(tbody)
  }

  updateTotals(totals) {
    const tbody = document.getElementById("totalSummaryBody")
    if (!tbody) return

    tbody.innerHTML = `
            <tr>
                <td class="px-4 py-2">Current Invoice</td>
                <td class="px-4 py-2 text-right">$${totals.currentInvoice.toFixed(2)}</td>
            </tr>
            <tr>
                <td class="px-4 py-2">Unpaid Invoice</td>
                <td class="px-4 py-2 text-right">$${totals.unpaidInvoice.toFixed(2)}</td>
            </tr>
            <tr class="font-bold">
                <td class="px-4 py-2">Total</td>
                <td class="px-4 py-2 text-right">$${totals.total.toFixed(2)}</td>
            </tr>
        `

    this.animateElement(tbody)
  }

  animateElement(element) {


    setTimeout(() => {
      element.style.transform = "scale(1)"
      element.style.backgroundColor = ""
    }, 300)
  }
}

// Initialize the invoice data manager when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new InvoiceDataManager()
})
