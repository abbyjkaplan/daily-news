# 🔍 **BigQuery Schema Browser for Cursor**

## ✅ **What's Available**

I've set up a comprehensive BigQuery schema browser that works directly in Cursor! You can now quickly view table schemas, search for tables, and explore your data without leaving your editor.

### **🎯 Available Commands:**

| Command | Keyboard Shortcut | Description |
|---------|------------------|-------------|
| **Schema Browser** | `Cmd+Shift+S` | Interactive schema browser |
| **List Datasets** | `Cmd+Shift+D` | Show all datasets in moma-dw |
| **Validate Query** | `Cmd+Shift+V` | Validate current SQL file |
| **Validate Clipboard** | `Cmd+Shift+B` | Validate SQL from clipboard |

## 🚀 **How to Use Schema Browser**

### **Method 1: Keyboard Shortcuts (Fastest)** ⭐

1. **Press `Cmd+Shift+S`** in Cursor
2. **Interactive mode opens** in terminal
3. **Type commands** to explore schemas

### **Method 2: Command Palette**

1. **Press `Cmd+Shift+P`**
2. **Type**: "Tasks: Run Task"
3. **Select**: "BigQuery Schema Browser"

### **Method 3: Terminal Commands**

```bash
# Interactive schema browser
python3 cursor_schema_browser.py interactive

# List all datasets
python3 cursor_schema_browser.py datasets

# Show table schema
python3 cursor_schema_browser.py schema emarsys_us.email_campaigns_v2

# Search for tables
python3 cursor_schema_browser.py search campaign

# Show sample data
python3 cursor_schema_browser.py sample emarsys_us.email_campaigns_v2
```

## 📊 **Interactive Schema Browser Commands**

When you run the interactive browser (`Cmd+Shift+S`), you can use these commands:

### **Basic Commands:**
- `datasets` - List all datasets
- `tables <dataset_id>` - List tables in dataset
- `schema <table_id>` - Show table schema
- `search <term>` - Search for tables
- `sample <table_id>` - Show sample data
- `help` - Show all commands
- `quit` - Exit

### **Examples:**

```
BigQuery> datasets
📁 Datasets in project: moma-dw
==================================================
  📂 emarsys_us
  📂 marketing
  📂 retail_stage
  ...

BigQuery> tables emarsys_us
📋 Tables in dataset: emarsys_us
==================================================
  📄 email_campaigns_v2
  📄 email_events
  📄 contacts
  ...

BigQuery> schema emarsys_us.email_campaigns_v2
📋 Table Schema: emarsys_us.email_campaigns_v2
================================================================================
🔍 Project: moma-dw
📊 Dataset: emarsys_us
📝 Table: email_campaigns_v2
📅 Created: 2024-06-05 12:34:39.831000+00:00
🔄 Modified: 2025-09-24 07:00:06.962000+00:00
📏 Rows: 5,688,307
💾 Size: 1,050,107,178 bytes

📋 Columns:
--------------------------------------------------------------------------------
  campaign_id                    INTEGER         NULL
  origin_campaign_id             INTEGER         NULL
  name                           STRING          NULL
  category_name                  STRING          NULL
  event_time                     TIMESTAMP       NULL
  ...

⏰ Partitioned by: loaded_at
```

## 🎯 **Quick Schema Lookup for Your Current Query**

Since you're working with `daily_campaign_optimized.sql`, here are the tables you're using:

### **1. Check emarsys_us.email_campaigns_v2:**
```bash
python3 cursor_schema_browser.py schema emarsys_us.email_campaigns_v2
```

### **2. Check emarsys_us.email_events:**
```bash
python3 cursor_schema_browser.py schema emarsys_us.email_events
```

### **3. Check marketing.contact:**
```bash
python3 cursor_schema_browser.py schema moma-dw-dev.marketing.contact
```

## 🔍 **Schema Information You'll See**

For each table, you'll get:

- **📊 Basic Info**: Project, dataset, table name
- **📅 Timestamps**: Created and modified dates
- **📏 Statistics**: Row count and size
- **📋 Columns**: Name, type, and nullability
- **⏰ Partitioning**: How the table is partitioned
- **🔗 Clustering**: Clustering fields (if any)
- **📝 Descriptions**: Column descriptions (if available)

## 🎯 **Pro Tips**

### **1. Quick Schema Lookup:**
- **Press `Cmd+Shift+S`** for interactive browser
- **Press `Cmd+Shift+D`** to list all datasets
- **Use `search` command** to find tables by name

### **2. While Writing Queries:**
1. **Start typing** your table name
2. **Press `Cmd+Shift+S`** to open schema browser
3. **Type `schema <table_name>`** to see structure
4. **Go back to Cursor** and continue writing

### **3. Debugging Queries:**
- **Use `sample` command** to see actual data
- **Check column types** to fix type mismatches
- **Verify table names** before running queries

### **4. Exploring New Datasets:**
```bash
# List all datasets
BigQuery> datasets

# List tables in a dataset
BigQuery> tables emarsys_us

# Search for specific tables
BigQuery> search campaign
```

## 🚀 **Quick Start Demo**

**Try this right now:**

1. **Press `Cmd+Shift+S`** in Cursor
2. **Type**: `schema emarsys_us.email_campaigns_v2`
3. **See the full schema** for your campaign table
4. **Type**: `quit` to exit

## 🎉 **You're All Set!**

Your Cursor editor now has **professional BigQuery schema browsing** built right in!

**Available Shortcuts:**
- **`Cmd+Shift+S`** - Interactive schema browser
- **`Cmd+Shift+D`** - List all datasets
- **`Cmd+Shift+V`** - Validate SQL queries
- **`Cmd+Shift+B`** - Validate clipboard

**Happy exploring!** 🚀
