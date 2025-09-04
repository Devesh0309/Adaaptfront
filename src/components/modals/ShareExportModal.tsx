import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';
import { cn } from '../ui/utils';
import { 
  Share2, 
  Download, 
  Copy, 
  FileText, 
  FileSpreadsheet,
  Presentation,
  Shield,
  Clock,
  CheckCircle
} from 'lucide-react';

interface ShareExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  type?: 'share' | 'export';
}

export function ShareExportModal({ 
  open, 
  onOpenChange, 
  title = "Untitled Analysis",
  type = 'share'
}: ShareExportModalProps) {
  const [shareMethod, setShareMethod] = useState<'link' | 'email'>('link');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'ppt' | 'xlsx'>('pdf');
  const [expiryDays, setExpiryDays] = useState('7');
  const [includeData, setIncludeData] = useState(true);
  const [emailRecipients, setEmailRecipients] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setShareLink(`https://dataai.company.com/shared/${Math.random().toString(36).substr(2, 9)}`);
    setIsGenerating(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Link copied to clipboard');
  };

  const handleExport = () => {
    toast.success(`Exporting as ${exportFormat.toUpperCase()}...`);
    onOpenChange(false);
  };

  const handleShare = () => {
    if (shareMethod === 'email' && !emailRecipients.trim()) {
      toast.error('Please enter email recipients');
      return;
    }
    
    if (shareMethod === 'link' && !shareLink) {
      handleGenerateLink();
      return;
    }

    toast.success('Analysis shared successfully');
    onOpenChange(false);
  };

  const formatIcons = {
    pdf: FileText,
    ppt: Presentation,
    xlsx: FileSpreadsheet
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'share' ? (
              <Share2 className="w-5 h-5" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {type === 'share' ? 'Share Analysis' : 'Export Analysis'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Analysis Info */}
          <div className="space-y-2">
            <Label className="text-sm text-text-secondary">Analysis</Label>
            <div className="font-medium text-text-primary">{title}</div>
            <div className="text-xs text-text-secondary">Last updated 2 minutes ago</div>
          </div>

          {/* RBAC Warning */}
          <Alert>
            <Shield className="w-4 h-4" />
            <AlertDescription className="text-xs">
              Recipients will only see data they have permission to access. 
              Sensitive information is automatically filtered based on role-based access controls.
            </AlertDescription>
          </Alert>

          {type === 'share' ? (
            <>
              {/* Share Method */}
              <div className="space-y-3">
                <Label>Share method</Label>
                <RadioGroup 
                  value={shareMethod} 
                  onValueChange={(value: 'link' | 'email') => setShareMethod(value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="link" id="link" />
                    <Label htmlFor="link" className="flex-1 cursor-pointer">
                      Generate shareable link
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email" />
                    <Label htmlFor="email" className="flex-1 cursor-pointer">
                      Send via email
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {shareMethod === 'email' && (
                <div className="space-y-2">
                  <Label htmlFor="recipients">Email recipients</Label>
                  <Input
                    id="recipients"
                    placeholder="Enter email addresses separated by commas"
                    value={emailRecipients}
                    onChange={(e) => setEmailRecipients(e.target.value)}
                    className="focus-ring"
                  />
                </div>
              )}

              {shareMethod === 'link' && shareLink && (
                <div className="space-y-2">
                  <Label>Shareable link</Label>
                  <div className="flex gap-2">
                    <Input
                      value={shareLink}
                      readOnly
                      className="focus-ring"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCopyLink}
                      className="focus-ring"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Expiry */}
              <div className="space-y-2">
                <Label htmlFor="expiry">Link expires in</Label>
                <Select value={expiryDays} onValueChange={setExpiryDays}>
                  <SelectTrigger className="focus-ring">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="7">7 days (recommended)</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="never">Never expires</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <Clock className="w-3 h-3" />
                  <span>Default expiry helps maintain security</span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Export Format */}
              <div className="space-y-3">
                <Label>Export format</Label>
                <RadioGroup 
                  value={exportFormat} 
                  onValueChange={(value: 'pdf' | 'ppt' | 'xlsx') => setExportFormat(value)}
                >
                  {(['pdf', 'ppt', 'xlsx'] as const).map((format) => {
                    const Icon = formatIcons[format];
                    return (
                      <div key={format} className="flex items-center space-x-2">
                        <RadioGroupItem value={format} id={format} />
                        <Label htmlFor={format} className="flex items-center gap-2 flex-1 cursor-pointer">
                          <Icon className="w-4 h-4" />
                          <span className="capitalize">{format.toUpperCase()}</span>
                          {format === 'pdf' && <Badge variant="secondary" className="text-xs">Recommended</Badge>}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>

              {/* Include Data */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="include-data">Include raw data</Label>
                  <div className="text-xs text-text-secondary">
                    Include underlying data tables in export
                  </div>
                </div>
                <Switch
                  id="include-data"
                  checked={includeData}
                  onCheckedChange={setIncludeData}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter className="sm:justify-start">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="focus-ring"
          >
            Cancel
          </Button>
          <Button 
            onClick={type === 'share' ? handleShare : handleExport}
            disabled={isGenerating}
            className="gap-2 focus-ring"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                {type === 'share' ? (
                  <Share2 className="w-4 h-4" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {type === 'share' ? 'Share' : 'Export'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}